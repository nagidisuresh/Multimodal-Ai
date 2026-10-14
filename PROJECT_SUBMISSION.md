# 🏆 OmniMind AI — Project Submission Dossier
**Tagline:** "One Input. Every Insight."  
**Track:** Multimodal AI Hackathon  

---

## 1. Problem Statement (132 Words)
Knowledge today is trapped in heterogeneous formats: textbook PDFs, handwritten notes, high-resolution scans, voice memos, lecture audio recordings, and technical video clips. Existing AI tools process these modalities in disconnected silos. A student cannot synthesize textbook equations with a professor's spoken lecture and a 3D animation in one query. A clinician cannot cross-reference a patient history PDF, an X-ray radiograph, and an auscultation voice note without switching between three fragmented systems. This modality gap forces users into manual transcription, loses cross-format context, causes factual hallucinations, and slows critical decision-making. People need a unified intelligence layer capable of ingesting any format, extracting spatial, acoustic, and textual features, and providing verifiable answers grounded across all their sources with exact page, timestamp, and visual bounding box citations.

---

## 2. Solution Description

### Overview
OmniMind AI is a production-style, evidence-grounded multimodal workspace. Users create dedicated workspaces (e.g., "Engine Study", "Medical Case 102") and upload PDFs, images (including handwritten notes and scans), audio recordings, and short videos (up to 20MB per file). Users ask questions via text or voice (Web Speech API) and receive structured answers synthesized across ALL uploaded materials, complete with clickable citations that navigate directly to the exact PDF page, audio/video playback timestamp, or visual bounding box.

### How Multimodal AI is Integrated
- **Backend-Only AI Gateway**: All Google Gemini API calls are strictly routed through an authenticated Node.js/Express backend. Secret API keys never touch the client browser.
- **Multimodal Chunk Extraction**: When files are uploaded, Gemini extracts structured semantic chunks:
  - **PDFs**: Text paragraphs, diagrams, and formulas with 1-indexed page numbers.
  - **Images & Scans**: High-resolution OCR, handwriting transcription, and spatial region bounding boxes `{ x, y, width, height, label }`.
  - **Audio**: Time-stamped speech transcripts aligning spoken quotes to audio offsets.
  - **Video**: Keyframe scene summaries and timestamped moment markers.
- **Cross-Modal Grounding & Structured Retrieval**: The backend indexes chunks in PostgreSQL (full-text search and metadata filtering). When a user asks a question, relevant multi-source chunks are compiled and fed into Gemini with strict grounding instructions.
- **Structured JSON Output**: Gemini returns:
  ```json
  {
    "answer": "Cross-modal explanation...",
    "citations": [
      { "file": "IC_Engines_Chapter4.pdf", "page": 4, "excerpt": "Fig 4.2..." },
      { "file": "Lecture_Four_Strokes_Prof_Rao.mp3", "timestamp": "02:15", "excerpt": "..." },
      { "file": "Engine_Operation_Sim.mp4", "timestamp": "01:14", "region": { "x": 35, "y": 22, "w": 30, "h": 28 } }
    ],
    "confidence": 0.96,
    "missing_info": null,
    "follow_up_questions": ["..."]
  }
  ```

### Key Features
1. **Interactive 3-Panel Workspace**:
   - **Left Panel**: Universal upload (drag-and-drop, camera capture, microphone voice recording), file list with deletion.
   - **Center Panel**: Conversational Q&A with confidence meter, missing information notices, and clickable citation chips.
   - **Right Panel**: Source Viewer supporting PDF page jumping, image bounding box canvas overlays, and audio/video timestamp seeking.
2. **Output Studio**:
   - One-click Executive Summary
   - Difficulty Level Explanations (Beginner, Intermediate, Advanced)
   - Interactive 4-Question Mastery Quiz with immediate feedback
   - Revision Flashcards with 3D flip animations
   - Labeled Structural Diagram descriptions
   - Spoken Audio Revision using the browser Web Speech API ("Listen" button)
3. **Six Specialized Modes on One Engine**:
   - **LearnAble** (Primary Demo): Textbook PDF + lecture audio + video -> engine 4-stroke synthesis and math problem solving.
   - **VisionVoice** (Accessibility): Medicine label & sign reader with spoken output and mandatory pharmacist consultation advice.
   - **VisionCart** (Shopping): Visual product search with voice/text filters against catalog vectors.
   - **KitchenMate**: Fridge snapshot scanner -> ingredients, dairy allergen alerts, and quick recipes.
   - **HealthLens** (Clinical Decision Support): Multi-source case dossier with persistent non-diagnostic disclaimer.
   - **RoadSense** (Simulation): Dashcam vehicle/pedestrian tracking and Doppler siren acoustics.
4. **Trilingual Accessibility**: Full query input and spoken answers in English, Hindi (हिन्दी), and Telugu (తెలుగు).
5. **Zero-Trust Security**:
   - Supabase Row Level Security (RLS) ensures users can access only their own rows.
   - Private Supabase Storage bucket (`omnimind-files`) with folder-level access policies.
   - CORS restricted to the verified frontend origin.
   - Startup environment validation ensuring complete operational reliability.
