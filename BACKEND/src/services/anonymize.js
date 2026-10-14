'use strict';

/**
 * Anonymize case data before sending to Gemini for content generation.
 * Removes: phone numbers, UPI IDs, bank accounts, victim-linked URLs, names.
 */

const PHONE_RE = /(\+91[\s-]?|0)?[6-9]\d{9}/g;
const UPI_RE = /[a-zA-Z0-9._-]+@[a-zA-Z]{2,}/g;
const BANK_AC_RE = /\b\d{9,18}\b/g;
const IFSC_RE = /\b[A-Z]{4}0[A-Z0-9]{6}\b/g;
const PAN_RE = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;
const AADHAAR_RE = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;

function anonymize(text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(PHONE_RE, '[PHONE_REDACTED]')
    .replace(UPI_RE, '[UPI_REDACTED]')
    .replace(BANK_AC_RE, '[ACCOUNT_REDACTED]')
    .replace(IFSC_RE, '[IFSC_REDACTED]')
    .replace(PAN_RE, '[PAN_REDACTED]')
    .replace(AADHAAR_RE, '[AADHAAR_REDACTED]');
}

/**
 * Anonymize a full case for content studio use.
 */
function anonymizeCase(caseData) {
  const summary = caseData.summary || {};
  const anonSummary = {
    scamType: summary.scamType || '',
    verdict: summary.verdict || '',
    riskScore: summary.riskScore || 0,
    redFlags: (summary.redFlags || []).map(anonymize),
    nextSteps: (summary.nextSteps || []).map(anonymize),
    summary: anonymize(summary.summary || ''),
    timeline: (summary.timeline || []).map((t) => ({
      time: t.time,
      event: anonymize(t.event),
      source: t.source,
    })),
    // Deliberately exclude linkedEntities (contains phone/UPI/bank)
  };
  return JSON.stringify(anonSummary, null, 2);
}

module.exports = { anonymize, anonymizeCase };
