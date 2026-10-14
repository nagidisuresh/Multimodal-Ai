# 🎯 OmniMind AI — Official Hackathon Judge Demo Script

**Project**: OmniMind AI  
**Tagline**: *"One Input. Every Insight."*  
**Live URL**: `http://localhost:5173/omnimind` (or production URL `https://omnimind-ai.vercel.app`)  
**Target Duration**: 3–5 Minutes  

---

## ⏱️ Step-by-Step Walkthrough

### Step 1: The Problem & The Solution (30 Seconds)
- **Say**: *"Judges, people keep critical knowledge scattered across multiple formats — PDF textbooks, scanned notes, photos, medical scans, voice dictations, and video lectures. But existing tools force users into separate silos. A student cannot ask one question that connects a textbook formula, a professor's voice explanation, and a 3D animation. We built **OmniMind AI**: one unified multimodal platform that ingests images, PDFs, audio, and video, and provides answers grounded across ALL sources with interactive citations."*
- **Action**: Open the landing page or `/omnimind` workspace. Highlight the clean 3-panel architecture.

---

### Step 2: Primary Demo — LearnAble (90 Seconds)
- **Action**: Select the **LearnAble** mode tab.
- **Show the 3-Panel Layout**:
  - **Left Panel (Ingest & Files)**: Point to the uploaded sources:
    1. `IC_Engines_Chapter4.pdf` (Textbook diagrams & formulas)
    2. `Lecture_Four_Strokes_Prof_Rao.mp3` (Audio lecture on intake and compression strokes)
    3. `Engine_Operation_Sim.mp4` (3D animation of piston travel and spark timing)
  - Point out that users can drag & drop, capture via camera, or record via microphone with a 20MB limit.
- **The Cross-Modal Query**:
  - Ask: *"Explain the four strokes of the internal combustion engine using all three sources in simple English."*
  - (Demonstrate typing or clicking the Web Speech mic button).
- **The Signature Feature — Evidence-Linked Citations**:
  - Point to the AI response explaining the 4 strokes in simple English with confidence rating (0.96) and clickable citation chips:
  1. **Click Citation 1** (`[IC_Engines_Chapter4.pdf: Page 4]`):  
     👉 The Right-hand Source Viewer immediately jumps to the PDF viewer on Page 4 with highlighted text.
  2. **Click Citation 2** (`[Lecture_Four_Strokes_Prof_Rao.mp3: 02:15]`):  
     👉 The Audio Player seeks instantly to timestamp `02:15` where Professor Rao explains adiabatic compression.
  3. **Click Citation 3** (`[Engine_Operation_Sim.mp4: 01:14]`):  
     👉 The Video/Keyframe Viewer displays the cylinder chamber with an attention bounding box around the spark arc and piston head.

---

### Step 3: Multimodal Output Studio (60 Seconds)
- **Say**: *"OmniMind AI doesn't just answer questions; with one click in Output Studio, it turns multimodal understanding into multi-format learning artifacts."*
- **Action**:
  1. Click **Summary**: Instant cross-modal executive synthesis.
  2. Click **Explanation Level**: Switch seamlessly from **Beginner** ("bicycle pump in reverse") to **Intermediate** and **Advanced** (Otto cycle thermodynamics).
  3. Click **Quiz**: Interactive 4-question mastery quiz. Select an answer and show instant explanation.
  4. Click **Flashcards**: Click cards to demonstrate 3D flip effect between front concept and back explanation.
  5. Click **Diagram**: View labeled structural breakdown of cylinder block, valves, spark plug, and piston rod.
  6. Click **"Listen" Button**: Browser `speechSynthesis` speaks the spoken revision summary aloud in clean voice.

---

### Step 4: Specialized Modes Tour (60 Seconds)
- **Say**: *"The exact same multimodal pipeline powers specialized industry use cases via configuration:"*
- **1. VisionVoice (Accessibility)**:
  - Photo of a medicine label -> Reads aloud name, dosage (500mg), warnings, and expiry date in English, Hindi, or Telugu.
  - Highlights persistent advisory: *"Always verify with a licensed pharmacist."*
- **2. VisionCart (Shopping)**:
  - Apparel/shoe photo with natural filter: *"black, under ₹3,000"* -> Matches catalog inventory with similarity scores.
- **3. KitchenMate**:
  - Fridge photo -> Detects ingredients, flags dairy allergens (Paneer, Greek yogurt), asks user to verify ambiguous items, and outputs a 20-minute recipe with substitutions.
- **4. HealthLens (Decision Support ONLY)**:
  - Patient history PDF + Chest X-ray + Doctor voice memo -> Correlates crackles with lung zone opacity.
  - Highlights persistent disclaimer: *"Decision-support tool, not a diagnosis. Requires review by a qualified medical professional."*
- **5. RoadSense (Simulation Only)**:
  - Dashcam video + siren audio clip -> Detects pedestrian crosswalk, ambulance strobe, and emergency siren acoustic frequency (850Hz).
  - Clearly marked as a simulation.

---

### Step 5: Wrap-Up & Evaluation Metrics (30 Seconds)
- **Say**: *"We tested OmniMind AI on a 10-question multimodal benchmark covering all modes:
  - 100% Citation Accuracy
  - 236 ms average response latency
  - Full Row Level Security and zero-trust key isolation.
  OmniMind AI delivers on its tagline: One Input. Every Insight."*
