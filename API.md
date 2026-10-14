# ScamKavach REST API Documentation

Base URL: `http://localhost:5000/api` (or production backend URL)  
All protected endpoints require the HTTP header:  
`Authorization: Bearer <jwt_token>`

---

## 1. Authentication Endpoints

### 1.1 Register Account
- **POST** `/auth/register`
- **Rate Limit**: 10 attempts / 15 minutes
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```
- **Response (201 Created)**:
```json
{
  "message": "Account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "e3b0c442-98fc-1c14-9afb-f4c596297e26",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

### 1.2 Login
- **POST** `/auth/login`
- **Rate Limit**: 10 attempts / 15 minutes
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```
- **Response (200 OK)**:
```json
{
  "message": "Logged in successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "e3b0c442-98fc-1c14-9afb-f4c596297e26",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

### 1.3 Current User Profile
- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "user": {
    "id": "e3b0c442-98fc-1c14-9afb-f4c596297e26",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

### 1.4 Delete Account & Erase All Data
- **DELETE** `/auth/account`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "message": "Account and all associated data deleted."
}
```

---

## 2. Cases Endpoints

### 2.1 Create Case
- **POST** `/cases`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "title": "Digital Arrest Extortion Call",
  "description": "WhatsApp video call with fake police logos demanding ₹1,00,000 bond.",
  "language": "en" // "en" | "te" | "hi"
}
```
- **Response (201 Created)**: Returns the newly created case row.

### 2.2 List Cases (Scoped to User)
- **GET** `/cases`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "cases": [
    {
      "id": "7a35da7e-6147-4976-b33c-333333333333",
      "title": "Digital Arrest Extortion Call",
      "description": "WhatsApp video call...",
      "language": "en",
      "status": "ANALYZED",
      "verdict": "SCAM",
      "risk_score": 92,
      "created_at": "2026-10-13T06:00:00Z",
      "updated_at": "2026-10-13T06:05:00Z"
    }
  ]
}
```

### 2.3 Get Single Case
- **GET** `/cases/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Full case row including `summary`, `timeline`, and `linked_entities`.

### 2.4 Update Case
- **PATCH** `/cases/:id`
- **Request Body**: Any of `title`, `description`, `language`, `status`.

### 2.5 Delete Case
- **DELETE** `/cases/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Deletes case and cascades to all evidence and conversations.

---

## 3. Evidence Ingestion & Forensic Processing

### 3.1 Upload Evidence File
- **POST** `/cases/:id/evidence`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Form Data**:
  - `file`: Binary file (JPEG, PNG, WebP, PDF, MP3, WAV, MP4, TXT; max 20MB)
- **Validation**: Magic byte binary signature validation.
- **Response (201 Created)**:
```json
{
  "evidence": {
    "id": "11111111-2222-3333-4444-555555555555",
    "case_id": "7a35da7e-6147-4976-b33c-333333333333",
    "evidence_type": "IMAGE",
    "file_name": "whatsapp_screenshot.png",
    "mime_type": "image/png",
    "size_bytes": 450212,
    "status": "uploaded"
  },
  "message": "File uploaded. Analysis started."
}
```

### 3.2 Ingest Pasted Text or Link
- **POST** `/cases/:id/evidence/paste`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "evidence_type": "LINK", // "TEXT" | "LINK"
  "content": "https://sbi-kyc-verify-login.apk.xyz"
}
```
- **Response (201 Created)**: Returns evidence record and triggers background analysis.

### 3.3 List Evidence for Case
- **GET** `/cases/:id/evidence`
- **Headers**: `Authorization: Bearer <token>`

### 3.4 Get Evidence with Signed URL
- **GET** `/evidence/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Returns evidence row and a 60-second temporary `signedUrl`.

### 3.5 Re-Analyze Evidence
- **POST** `/evidence/:id/reanalyze` (or `/evidence/:id/retry`)
- **Headers**: `Authorization: Bearer <token>`

### 3.6 Delete Evidence
- **DELETE** `/evidence/:id`
- **Headers**: `Authorization: Bearer <token>`

### 3.7 Global Evidence Vault (My Files)
- **GET** `/files`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Returns list of all evidence files across all cases owned by user.

---

## 4. AI Forensics, Chat & Complaint Endpoints

### 4.1 Synthesize Case Summary
- **POST** `/cases/:id/summarize`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "summary": {
    "verdict": "SCAM",
    "riskScore": 95,
    "scamType": "Digital Arrest Extortion Syndicate",
    "confidence": 0.98,
    "summary": "Suspects impersonated cyber police via WhatsApp video and issued a fraudulent warrant.",
    "redFlags": [
      "No Indian police agency conducts digital arrests over WhatsApp",
      "Demanded immediate transfer to an unverified private bank account",
      "Fake official seals and forged CBI letterhead"
    ],
    "linkedEntities": [
      {
        "value": "+91 98765 43210",
        "type": "PHONE",
        "foundIn": ["whatsapp_screenshot.png", "call_recording.mp3"],
        "importance": "HIGH"
      },
      {
        "value": "policecbi@okaxis",
        "type": "UPI",
        "foundIn": ["whatsapp_screenshot.png"],
        "importance": "HIGH"
      }
    ],
    "timeline": [
      {
        "time": "10:15 AM",
        "event": "Initial spoofed call received claiming Aadhaar misused in Mumbai narcotics case",
        "source": "call_recording.mp3"
      }
    ],
    "nextSteps": [
      "File an immediate complaint on Helpline 1930 within the golden hour",
      "Contact your bank to freeze transactions to the fraudulent account",
      "Block the sender number and do not attend further video calls"
    ]
  },
  "message": "Case summary generated."
}
```

### 4.2 Ask-Your-Case Chat (with Citations)
- **POST** `/cases/:id/chat`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "question": "What phone number was used by the perpetrator?",
  "conversation_id": "optional-uuid"
}
```
- **Response (200 OK)**:
```json
{
  "answer": "Based on the evidence, the caller used +91 98765 43210 to initiate the WhatsApp video call.",
  "sources": [
    {
      "fileName": "whatsapp_screenshot.png",
      "evidenceId": "11111111-2222-3333-4444-555555555555",
      "note": "Visible in caller header"
    }
  ],
  "conversation_id": "uuid"
}
```

### 4.3 Generate Official 1930 Cybercrime Complaint Draft
- **POST** `/cases/:id/complaint`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "victim_name": "Rahul Sharma",
  "victim_phone": "+91 99999 88888",
  "incident_date": "2026-10-13",
  "amount_lost": "₹50,000"
}
```
- **Response (200 OK)**:
```json
{
  "complaint": "To:\nThe Superintendent of Police / Cyber Crime Cell\n...",
  "disclaimer": "AI-generated draft. Review before submission."
}
```

---

## 5. Content Studio & Learn Mode

### 5.1 Generate Anonymized Public Post
- **POST** `/content/generate`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "case_id": "7a35da7e-6147-4976-b33c-333333333333",
  "platform": "Instagram", // "Instagram" | "LinkedIn" | "X" | "WhatsApp" | "YouTube"
  "format": "Post",
  "tone": "informative",
  "audience": "general public",
  "language": "en",
  "length": "medium"
}
```
- **Response (200 OK)**: Returns generated post with all PII scrubbed.

### 5.2 Load Learn Mode Walkthrough & Quiz
- **POST** `/cases/:id/learn`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "scam_type": "Digital Arrest Scam",
  "level": "beginner" // "beginner" | "intermediate" | "advanced"
}
```
- **Response (200 OK)**: Returns steps with narration text and 5 quiz questions.

### 5.3 Submit Quiz Attempt
- **POST** `/learn/quiz-attempt`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "quiz_id": "uuid",
  "answers": [
    { "question_index": 0, "selected_index": 1 },
    { "question_index": 1, "selected_index": 2 },
    { "question_index": 2, "selected_index": 0 },
    { "question_index": 3, "selected_index": 3 },
    { "question_index": 4, "selected_index": 1 }
  ]
}
```
- **Response (200 OK)**: Returns score, total, and updates learning progress.

---

## 6. Dashboard & Smart Search

### 6.1 Dashboard Statistics
- **GET** `/dashboard/stats`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "totalCases": 4,
  "totalEvidence": 11,
  "casesByVerdict": { "SCAM": 3, "SUSPICIOUS": 1 },
  "recentCases": [...],
  "recentEvidence": [...],
  "quizStats": { "totalAttempts": 2, "avgScore": 80 },
  "recentProgress": [...]
}
```

### 6.2 Smart Search (Full-Text & Entity JSON)
- **GET** `/search?q=9876543210`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Returns ranked list of matching evidence records across all cases.
