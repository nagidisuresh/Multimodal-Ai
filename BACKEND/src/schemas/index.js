'use strict';

const { z } = require('zod');

// ─── Auth Schemas ─────────────────────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().trim().default('User').optional().transform(v => v || 'User'),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required').max(128),
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

// ─── Case Schemas ─────────────────────────────────────────────────────────────
const createCaseSchema = z.object({
  title: z.string().min(3).max(500).trim(),
  description: z.string().max(2000).trim().optional(),
  language: z.enum(['en', 'te', 'hi']).default('en'),
});

const updateCaseSchema = z.object({
  title: z.string().min(3).max(500).trim().optional(),
  description: z.string().max(2000).trim().optional(),
  language: z.enum(['en', 'te', 'hi']).optional(),
  status: z.enum(['OPEN', 'ANALYZED', 'CLOSED']).optional(),
});

// ─── Evidence Schemas ─────────────────────────────────────────────────────────
const pasteEvidenceSchema = z.object({
  evidence_type: z.enum(['TEXT', 'LINK']),
  content: z.string().min(1).max(50000).trim(),
});

// ─── Chat Schema ──────────────────────────────────────────────────────────────
const chatSchema = z.object({
  question: z.string().min(1).max(2000).trim(),
  conversation_id: z.string().uuid().optional(),
  selected_evidence_ids: z.array(z.string().uuid()).optional(),
});

// ─── Complaint Schema ─────────────────────────────────────────────────────────
const complaintSchema = z.object({
  victim_name: z.string().min(1).max(200).trim().optional(),
  victim_phone: z.string().max(20).trim().optional(),
  incident_date: z.string().optional(),
  amount_lost: z.string().max(200).trim().optional(),
});

// ─── Content Studio Schema ────────────────────────────────────────────────────
const contentSchema = z.object({
  case_id: z.string().uuid(),
  platform: z.enum(['Instagram', 'YouTube', 'LinkedIn', 'Facebook', 'X', 'WhatsApp']),
  format: z.string().min(1).max(100),
  tone: z.string().max(100).optional().default('informative'),
  audience: z.string().max(100).optional().default('general public'),
  language: z.enum(['en', 'te', 'hi']).default('en'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
});

// ─── Learn Mode Schema ────────────────────────────────────────────────────────
const learnSchema = z.object({
  scam_type: z.string().min(1).max(200).trim().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
});

const quizAttemptSchema = z.object({
  quiz_id: z.string().uuid(),
  answers: z.array(z.object({
    question_index: z.number().int().min(0),
    selected_index: z.number().int().min(0).max(3),
  })),
});

// ─── Conversation Schemas ─────────────────────────────────────────────────────
const createConversationSchema = z.object({
  title: z.string().min(1).max(500).trim().default('New Conversation'),
});

const renameConversationSchema = z.object({
  title: z.string().min(1).max(500).trim(),
});

// ─── AI Output Schemas (Zod validation on Gemini responses) ──────────────────
const perFileAnalysisSchema = z.object({
  verdict: z.enum(['SAFE', 'SUSPICIOUS', 'SCAM']),
  riskScore: z.number().min(0).max(100),
  scamType: z.string(),
  confidence: z.number().min(0).max(1),
  redFlags: z.array(z.string()),
  extracted: z.object({
    phones: z.array(z.string()),
    upiIds: z.array(z.string()),
    urls: z.array(z.string()),
    bankAccounts: z.array(z.string()),
    amounts: z.array(z.string()),
    names: z.array(z.string()),
    dates: z.array(z.string()),
  }),
  transcript: z.string(),
  explanation: z.string(),
  nextSteps: z.array(z.string()),
});

const linkedEntitySchema = z.object({
  value: z.string(),
  type: z.enum(['PHONE', 'UPI', 'URL', 'BANK_ACCOUNT', 'AMOUNT', 'NAME', 'DATE']),
  foundIn: z.array(z.string()),
  importance: z.enum(['HIGH', 'MEDIUM', 'LOW']),
});

const timelineEventSchema = z.object({
  time: z.string(),
  event: z.string(),
  source: z.string(),
});

const caseSummarySchema = z.object({
  verdict: z.enum(['SAFE', 'SUSPICIOUS', 'SCAM']),
  riskScore: z.number().min(0).max(100),
  scamType: z.string(),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  redFlags: z.array(z.string()),
  linkedEntities: z.array(linkedEntitySchema),
  timeline: z.array(timelineEventSchema),
  nextSteps: z.array(z.string()),
});

const chatResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(z.object({
    fileName: z.string(),
    evidenceId: z.string(),
    note: z.string().optional(),
  })),
});

const learnStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  actor: z.string().optional(),
  warningSign: z.string().optional(),
  narration: z.string(),
});

const learnModeSchema = z.object({
  scamType: z.string(),
  level: z.string(),
  steps: z.array(learnStepSchema),
  components: z.array(z.string()).optional(),
  relationships: z.array(z.string()).optional(),
  safetyTips: z.array(z.string()),
  quiz: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()).length(4),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string(),
  })).length(5),
});

// ─── Visual Learn / VisualMind Schemas ────────────────────────────────────────
const visualExplainSchema = z.object({
  topic: z.string().min(2).max(500).trim(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  language: z.enum(['en', 'te', 'hi']).default('en'),
});

const visualComponentSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
});

const visualStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  highlight: z.array(z.string()),
  narration: z.string(),
});

const visualQuizItemSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
});

const visualLessonOutputSchema = z.object({
  explanation: z.string(),
  components: z.array(visualComponentSchema),
  steps: z.array(visualStepSchema),
  realWorldExample: z.string(),
  quiz: z.array(visualQuizItemSchema).length(5),
});

// ─── Google Auth Schema ───────────────────────────────────────────────────────
const googleAuthSchema = z.object({
  credential: z.string().min(100, 'Invalid Google credential token'),
});

module.exports = {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  createCaseSchema,
  updateCaseSchema,
  pasteEvidenceSchema,
  chatSchema,
  complaintSchema,
  contentSchema,
  learnSchema,
  quizAttemptSchema,
  createConversationSchema,
  renameConversationSchema,
  perFileAnalysisSchema,
  caseSummarySchema,
  chatResponseSchema,
  learnModeSchema,
  visualExplainSchema,
  visualLessonOutputSchema,
};
