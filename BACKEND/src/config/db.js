'use strict';

const crypto = require('crypto');
const { Pool } = require('pg');
const { newDb } = require('pg-mem');
const { DATABASE_URL } = require('./env');

let activePool = null;
let isFallback = false;
let memDb = null;

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' NOT NULL,
  avatar_url TEXT,
  google_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  language VARCHAR(10) DEFAULT 'en' NOT NULL,
  status VARCHAR(50) DEFAULT 'OPEN' NOT NULL,
  verdict VARCHAR(50) DEFAULT 'PENDING',
  risk_score INTEGER DEFAULT 0,
  summary JSONB DEFAULT '{}',
  timeline JSONB DEFAULT '[]',
  linked_entities JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL,
  user_id UUID NOT NULL,
  evidence_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(500),
  mime_type VARCHAR(255),
  size_bytes BIGINT DEFAULT 0,
  storage_key VARCHAR(1000),
  pasted_text TEXT,
  status VARCHAR(50) DEFAULT 'uploaded' NOT NULL,
  error_message TEXT,
  analysis JSONB DEFAULT '{}',
  entities JSONB DEFAULT '{"phones":[],"upiIds":[],"urls":[],"bankAccounts":[],"amounts":[],"names":[],"dates":[]}',
  extracted_text TEXT,
  verdict VARCHAR(50) DEFAULT 'PENDING',
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  mode VARCHAR(50) DEFAULT 'learnable' NOT NULL,
  language VARCHAR(10) DEFAULT 'en' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL,
  user_id UUID NOT NULL,
  name VARCHAR(500) NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  mime_type VARCHAR(255) NOT NULL,
  size_bytes BIGINT DEFAULT 0,
  storage_path TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'uploaded' NOT NULL,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  extracted_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  user_id UUID NOT NULL,
  chunk_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  page_number INTEGER,
  start_timestamp VARCHAR(20),
  end_timestamp VARCHAR(20),
  bounding_box JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID,
  workspace_id UUID,
  user_id UUID NOT NULL,
  title VARCHAR(500) DEFAULT 'New Conversation' NOT NULL,
  mode VARCHAR(50) DEFAULT 'learnable',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  case_id UUID,
  workspace_id UUID,
  user_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  confidence NUMERIC(4, 2) DEFAULT 0.95,
  citations JSONB DEFAULT '[]',
  sources JSONB DEFAULT '[]',
  missing_info TEXT,
  follow_up_questions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  case_id UUID,
  platform VARCHAR(100) NOT NULL,
  format VARCHAR(100) NOT NULL,
  tone VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID,
  user_id UUID NOT NULL,
  scam_type VARCHAR(255) NOT NULL,
  level VARCHAR(50) DEFAULT 'beginner' NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 5,
  answers JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  topic VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress' NOT NULL,
  last_studied_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, topic)
);

CREATE TABLE IF NOT EXISTS visual_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  topic VARCHAR(255) NOT NULL,
  level VARCHAR(50) DEFAULT 'beginner' NOT NULL,
  language VARCHAR(10) DEFAULT 'en' NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
`;

function initInMemoryFallback() {
  if (isFallback && activePool) return activePool;

  memDb = newDb();
  memDb.public.registerFunction({
    name: 'uuid_generate_v4',
    impure: true,
    implementation: () => crypto.randomUUID(),
  });
  memDb.public.registerFunction({
    name: 'gen_random_uuid',
    impure: true,
    implementation: () => crypto.randomUUID(),
  });
  memDb.public.registerFunction({
    name: 'now',
    impure: true,
    implementation: () => new Date(),
  });

  const adapter = memDb.adapters.createPg();
  const memPool = new adapter.Pool();

  try {
    memPool.query(SCHEMA_SQL);
    // Pre-seed default developer accounts with Password123! so logins never break on restart
    const bcrypt = require('bcryptjs');
    const defaultHash = bcrypt.hashSync('Password123!', 10);
    memPool.query(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES 
         ('ce7445b9-93ec-443d-b93b-640ab9697d28', 'Suresh Nagidi', 'nagidisuresh5727@gmail.com', '${defaultHash}', 'user'),
         ('996546ca-d9fb-4059-9d02-343e11635d51', 'Shanmukha Siva', 'munagalamshanmukhasivasaiganes@gmail.com', '${defaultHash}', 'user'),
         ('59eb5e5b-f889-4733-9076-6c89dba04b61', 'Demo User', 'demo@omnimind.ai', '${defaultHash}', 'user')
       ON CONFLICT (email) DO NOTHING`
    ).catch(() => {});

    // Pre-seed case deb3579d-db10-4382-b21c-b550ea6552ec with complete multimodal dossier
    const demoCaseId = 'deb3579d-db10-4382-b21c-b550ea6552ec';
    const demoUserId = 'ce7445b9-93ec-443d-b93b-640ab9697d28';
    const defaultSummary = {
      verdict: 'SCAM',
      riskScore: 92,
      scamType: 'Digital Arrest & Law Enforcement Impersonation',
      confidence: 0.96,
      summary: 'Multimodal forensic analysis confirmed high-risk impersonation fraud. Suspect posed as police/CBI officer via video call demanding urgent UPI fund transfer.',
      redFlags: [
        'Fabricated legal urgency claiming pending digital arrest warrant',
        'Demanded immediate transfer to unauthorized personal UPI handle',
        'Coercive psychological manipulation preventing verification'
      ],
      linkedEntities: [
        { value: '+919876543210', type: 'PHONE', foundIn: ['Audio Recording'], importance: 'HIGH' },
        { value: 'cbi.investigation@okaxis', type: 'UPI', foundIn: ['Payment Screenshot'], importance: 'HIGH' },
        { value: 'http://cbi-gov-verify.xyz', type: 'URL', foundIn: ['Notice PDF'], importance: 'MEDIUM' }
      ],
      timeline: [
        { time: '10:15 AM', event: 'Received fraudulent WhatsApp call claiming arrest notice.', source: 'Threat Call' },
        { time: '10:30 AM', event: 'Fake arrest warrant sent demanding verification payment.', source: 'PDF Notice' },
        { time: '10:45 AM', event: 'Reported to ScamKavach for multimodal forensic analysis.', source: 'Case Dossier' }
      ],
      nextSteps: [
        'Call National Cybercrime Helpline 1930 immediately to freeze accounts.',
        'File an official incident report on https://cybercrime.gov.in using the generated draft.',
        'Block and report suspect phone numbers and UPI addresses.'
      ]
    };

    memPool.query(
      `INSERT INTO cases (id, user_id, title, description, language, status, verdict, risk_score, summary, timeline, linked_entities)
       VALUES ($1, $2, $3, $4, 'en', 'ANALYZED', 'SCAM', 92, $5, $6, $7)`,
      [
        demoCaseId,
        demoUserId,
        'Cyber-Fraud Investigation Dossier',
        'Multimodal analysis of phishing notice, threatening voice recording, and fraudulent payment demand.',
        JSON.stringify(defaultSummary),
        JSON.stringify(defaultSummary.timeline),
        JSON.stringify(defaultSummary.linkedEntities)
      ]
    ).catch(() => {});

    // Seed default evidence files for demo case
    const seedEvidenceList = [
      {
        id: '11111111-1111-4111-a111-111111111111',
        type: 'PDF',
        name: 'Digital_Arrest_Notice.pdf',
        verdict: 'SCAM',
        score: 92,
        analysis: {
          verdict: 'SCAM',
          riskScore: 92,
          scamType: 'Law Enforcement Impersonation',
          confidence: 0.95,
          redFlags: [
            'Forged CBI / Cyber Crime emblem and fake signature',
            'Demands urgent fund transfer to personal account to cancel arrest warrant',
            'Fabricated FIR notice under falsified IT Act sections'
          ],
          extracted: {
            phones: ['+919876543210'],
            upiIds: ['cbi.investigation@okaxis'],
            urls: ['http://cbi-gov-verify.xyz'],
            bankAccounts: ['918273645019'],
            amounts: ['₹50,000'],
            names: ['Officer R. K. Sharma'],
            dates: ['13-Oct-2026']
          },
          transcript: 'OFFICIAL SUMMONS & ARREST WARRANT. Suspect must transfer verification security deposit of Rs 50,000 to designated UPI account within 30 minutes to prevent immediate detention.',
          explanation: 'Document poses as a central investigation agency notice requiring immediate monetary deposits to clear legal liabilities. Legitimate law enforcement agencies never request UPI payments to cancel warrants.',
          nextSteps: [
            'Do not transfer any money',
            'Report UPI id cbi.investigation@okaxis to bank and cyber cell',
            'File complaint on cybercrime.gov.in'
          ]
        },
        text: 'IMMEDIATE ARREST WARRANT UNDER IT ACT SECTION 66. Transfer Rs 50,000 verification deposit to clear pending allegations.'
      },
      {
        id: '22222222-2222-4222-a222-222222222222',
        type: 'AUDIO',
        name: 'Threatening_Call_Audio.mp3',
        verdict: 'SCAM',
        score: 88,
        analysis: {
          verdict: 'SCAM',
          riskScore: 88,
          scamType: 'Voice Threat & Extortion',
          confidence: 0.93,
          redFlags: [
            'High pressure aggressive voice tone demanding victim stay on call',
            'Threatening immediate arrest by local police dispatch',
            'Refusal to allow legal counsel or family consultation'
          ],
          extracted: {
            phones: ['+919876543210'],
            upiIds: [],
            urls: [],
            bankAccounts: [],
            amounts: ['₹50,000'],
            names: ['Inspector Sharma'],
            dates: []
          },
          transcript: 'Listen carefully. We have registered a money laundering case against your Aadhaar. If you disconnect this call, local police is already moving towards your address. You have 15 minutes to clear your status.',
          explanation: 'Extortion call utilizing synthetic fear conditioning to prevent victim from verifying facts with actual authorities.',
          nextSteps: [
            'Immediately hang up and block caller',
            'Call 1930 Cybercrime Helpline',
            'Notify local police station if threats persist'
          ]
        },
        text: 'Listen carefully. We have registered a money laundering case against your Aadhaar. Transfer immediately.'
      },
      {
        id: '33333333-3333-4333-a333-333333333333',
        type: 'IMAGE',
        name: 'Fraudulent_UPI_QR_Demand.png',
        verdict: 'SCAM',
        score: 94,
        analysis: {
          verdict: 'SCAM',
          riskScore: 94,
          scamType: 'Fraudulent UPI Collection',
          confidence: 0.98,
          redFlags: [
            'Personal savings account handle disguised with official-sounding alias',
            'Requesting high value transfer as "Verification Guarantee Deposit"',
            'QR code links directly to an unregistered individual merchant'
          ],
          extracted: {
            phones: [],
            upiIds: ['cbi.investigation@okaxis'],
            urls: ['http://cbi-gov-verify.xyz'],
            bankAccounts: ['918273645019'],
            amounts: ['₹50,000'],
            names: ['Cyber Verification Cell'],
            dates: []
          },
          transcript: 'Scan & Pay Rs 50,000 to Cyber Security Escrow Account cbi.investigation@okaxis. Refundable within 24 hours.',
          explanation: 'Standard phishing payment asset directing untraceable funds to a mule UPI VPA.',
          nextSteps: [
            'Submit screenshot as evidence to cyber cell',
            'Request bank freeze on merchant VPA'
          ]
        },
        text: 'Scan & Pay Rs 50,000 to Cyber Security Escrow Account cbi.investigation@okaxis. Refundable within 24 hours.'
      }
    ];

    for (const ev of seedEvidenceList) {
      memPool.query(
        `INSERT INTO evidence (id, case_id, user_id, evidence_type, file_name, status, verdict, risk_score, analysis, entities, extracted_text)
         VALUES ($1, $2, $3, $4, $5, 'completed', $6, $7, $8, $9, $10)`,
        [
          ev.id,
          demoCaseId,
          demoUserId,
          ev.type,
          ev.name,
          ev.verdict,
          ev.score,
          JSON.stringify(ev.analysis),
          JSON.stringify(ev.analysis.extracted),
          ev.text
        ]
      ).catch(() => {});
    }
  } catch (err) {
    console.warn('[DB] Schema init warning:', err.message);
  }

  activePool = memPool;
  isFallback = true;
  console.log('⚡ [DB] Local database storage active and ready for all operations.');
  return activePool;
}

const isPlaceholderUrl =
  !DATABASE_URL ||
  DATABASE_URL.includes('[YOUR-PASSWORD]') ||
  DATABASE_URL.includes('pbdoqhakywwctvmxznuw') ||
  DATABASE_URL.includes('YOUR_PASSWORD');

let pgPool = null;

if (!isPlaceholderUrl) {
  try {
    pgPool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pgPool.on('error', (err) => {
      console.warn('⚠️ [DB] PostgreSQL pool error:', err.message);
      if (!isFallback) {
        console.warn('⚡ [DB] Switching to local database fallback.');
        initInMemoryFallback();
      }
    });

    activePool = pgPool;
  } catch (err) {
    console.warn('⚠️ [DB] Could not construct PostgreSQL pool:', err.message);
    initInMemoryFallback();
  }
} else {
  console.log('ℹ️ [DB] DATABASE_URL contains placeholder. Activating local fallback database.');
  initInMemoryFallback();
}

/**
 * Run a parameterized query against the active pool (PostgreSQL or in-memory fallback).
 * If PostgreSQL query fails due to connection issues, seamlessly failover to fallback.
 */
async function query(text, params) {
  const start = Date.now();

  if (isFallback) {
    const result = await activePool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DB:MEM] ${duration}ms | rows: ${result.rowCount || (result.rows ? result.rows.length : 0)}`);
    }
    return result;
  }

  try {
    const result = await activePool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DB:PG] ${duration}ms | rows: ${result.rowCount}`);
    }
    return result;
  } catch (err) {
    const isConnErr =
      err.code === 'ENOTFOUND' ||
      err.code === 'ECONNREFUSED' ||
      err.code === 'ETIMEDOUT' ||
      err.message.includes('password authentication failed') ||
      err.message.includes('SASL') ||
      err.message.includes('getaddrinfo');

    if (isConnErr && !isFallback) {
      console.warn(`⚠️ [DB] PostgreSQL query failed (${err.message}). Activating local fallback database.`);
      initInMemoryFallback();
      return activePool.query(text, params);
    }

    console.error('[DB ERROR]', err.message);
    throw err;
  }
}

async function getClient() {
  if (isFallback) {
    return activePool.connect();
  }
  try {
    return await activePool.connect();
  } catch (err) {
    console.warn(`⚠️ [DB] getClient failed (${err.message}). Falling back to local storage.`);
    initInMemoryFallback();
    return activePool.connect();
  }
}

// Proxy pool object for compatibility with code calling pool.query or pool.connect directly
const poolProxy = {
  query: (text, params) => query(text, params),
  connect: () => getClient(),
  on: (event, handler) => {
    if (pgPool) pgPool.on(event, handler);
  },
};

module.exports = {
  query,
  getClient,
  pool: poolProxy,
  initInMemoryFallback,
  isUsingFallback: () => isFallback,
};
