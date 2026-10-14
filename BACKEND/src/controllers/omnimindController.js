'use strict';

const { v4: uuidv4 } = require('uuid');

// Mode configurations & datasets
const MODES = {
  learnable: {
    id: 'learnable',
    name: 'LearnAble Student Assistant',
    tag: 'Primary Demo (Mode A)',
    icon: 'GraduationCap',
    color: 'teal',
    description: 'Synthesizes engineering & academic concepts across textbooks, lecture audio, and short videos with page citations and timestamp jumps.',
    disclaimer: 'Academic assistance tool. Validated with cross-modal textbook and video curriculum citations.',
    sampleQuery: 'Explain the four strokes of the internal combustion engine using all three sources in simple English.',
    files: [
      { id: 'f-eng-1', name: 'IC_Engines_Chapter4.pdf', type: 'pdf', size: '2.4 MB', status: 'PyMuPDF Indexed', pages: 18, meta: 'Textbook diagrams & thermodynamic formulas' },
      { id: 'f-eng-2', name: 'Lecture_Four_Strokes_Prof_Rao.mp3', type: 'audio', size: '8.1 MB', status: 'Whisper Transcribed', duration: '08:42', meta: 'Audio lecture on intake and compression strokes' },
      { id: 'f-eng-3', name: 'Engine_Operation_Sim.mp4', type: 'video', size: '14.5 MB', status: 'Keyframes Extracted', duration: '02:15', meta: '3D animation of piston travel and spark timing' },
    ],
    answer: {
      text: `Based on cross-modal synthesis across **IC_Engines_Chapter4.pdf**, the audio lecture by **Prof. Rao**, and the **3D Engine Operation Simulation**:\n\nThe internal combustion four-stroke engine operates in a continuous mechanical cycle:\n\n1. **Intake Stroke**: The intake valve opens as the piston descends from Top Dead Center (TDC) to Bottom Dead Center (BDC), drawing in the fuel-air mixture via atmospheric vacuum (referenced in **Textbook Page 4**).\n2. **Compression Stroke**: Both valves close tightly. The piston ascends, compressing the mixture to ~10:1 ratio, dramatically raising charge temperature (audio lecture timestamp **02:15**).\n3. **Power (Combustion) Stroke**: The spark plug discharges right before TDC, igniting the compressed gas. The explosive expansion forces the piston downward with peak kinetic torque (video simulation timestamp **01:14** and highlighted combustion chamber region).\n4. **Exhaust Stroke**: The exhaust valve unseats as the piston moves upward, expelling post-combustion gases out of the manifold.`,
      confidence: 0.96,
      latencyMs: 312,
      citations: [
        { file: 'IC_Engines_Chapter4.pdf', type: 'pdf', page: 4, excerpt: 'Fig 4.2: Piston descent creates negative pressure drawing air-fuel mixture past inlet valve.' },
        { file: 'Lecture_Four_Strokes_Prof_Rao.mp3', type: 'audio', timestamp: '02:15', excerpt: '[Prof. Rao]: "Notice that adiabatic compression heats the charge before the spark triggers."' },
        { file: 'Engine_Operation_Sim.mp4', type: 'video', timestamp: '01:14', region: { x: 35, y: 22, w: 30, h: 28, label: 'Combustion Chamber & Spark Arc' }, excerpt: 'Keyframe 74: Spark ignition creates peak cylinder pressure forcing piston downwards.' },
      ],
      missingInfo: null,
      followUps: [
        'How does thermodynamic efficiency compare between Otto and Diesel cycles?',
        'What happens if valve timing advances by 5 degrees?',
        'Can you generate a 4-question revision quiz for this topic?'
      ]
    }
  },

  visionvoice: {
    id: 'visionvoice',
    name: 'VisionVoice Accessibility',
    tag: 'Mode B',
    icon: 'Eye',
    color: 'emerald',
    description: 'Multilingual medicine label and prescription reader. Extracts dosage, expiry, warnings, and speaks aloud in English, Hindi, and Telugu.',
    disclaimer: 'Accessibility support tool. Always verify with a licensed pharmacist or medical practitioner.',
    sampleQuery: 'Read this medicine label aloud, extract dosage, warnings, and expiry date.',
    files: [
      { id: 'f-med-1', name: 'Paracetamol_500mg_Label.jpg', type: 'image', size: '1.2 MB', status: 'Gemini Vision OCR Ready', meta: 'High-res pharmaceutical blister packaging' }
    ],
    answer: {
      text: `**Pharmaceutical Label Extraction (VisionVoice):**\n\n- **Medication Name**: Paracetamol Tablets IP 500mg\n- **Prescribed Dosage**: 1 tablet every 6–8 hours as needed (Maximum 4 tablets / 2,000mg in 24 hours)\n- **Active Composition**: Paracetamol IP 500 mg per uncoated tablet\n- **Expiry Date**: EXP: 11/2027 (Batch No: B7492A)\n- **Critical Warning**: Taking more than daily maximum dose may cause serious liver damage or allergic reactions.\n- **Storage**: Store below 30°C in a dry place. Protect from direct sunlight.\n\n⚠️ *Mandatory Advisory: Always verify dosage and drug interactions with a qualified pharmacist.*`,
      confidence: 0.98,
      latencyMs: 245,
      citations: [
        { file: 'Paracetamol_500mg_Label.jpg', type: 'image', region: { x: 12, y: 18, w: 76, h: 24, label: 'Dosage & Composition Header' }, excerpt: 'PARACETAMOL TABLETS IP 500MG - BATCH B7492A - EXP 11/2027' }
      ],
      missingInfo: null,
      followUps: [
        'Read this warning aloud in Hindi (हिंदी)',
        'Read this warning aloud in Telugu (తెలుగు)',
        'What should I do if a dose is accidentally missed?'
      ]
    }
  },

  visioncart: {
    id: 'visioncart',
    name: 'VisionCart Shopping',
    tag: 'Mode C',
    icon: 'ShoppingBag',
    color: 'indigo',
    description: 'Image similarity matching for apparel and shoes with multimodal voice and price filters (e.g. "black, under ₹3,000").',
    disclaimer: 'E-commerce visual search demo using CLIP image embeddings against catalog inventory.',
    sampleQuery: 'Find matching running shoes in black, priced under ₹3,000.',
    files: [
      { id: 'f-shop-1', name: 'User_Shoe_Inspiration.jpg', type: 'image', size: '950 KB', status: 'CLIP Vectorized', meta: 'User uploaded photo of running sneaker' }
    ],
    answer: {
      text: `**Visual Catalog Matches (Filter: Black, Under ₹3,000):**\n\n1. **AeroGlide Pro Runner Black Edition** — **₹2,499** (94% Visual Match)\n   - Breathable mesh upper, EVA dual-density midsole, carbon rubber traction.\n2. **Stratus Stealth Trail Sneaker** — **₹2,850** (88% Visual Match)\n   - All-black weather-resistant knit, reflective night accents.\n3. **PulseFlex Everyday Trainer** — **₹1,999** (82% Visual Match)\n   - Lightweight memory foam insole, slip-resistant outsole.`,
      confidence: 0.92,
      latencyMs: 198,
      citations: [
        { file: 'User_Shoe_Inspiration.jpg', type: 'image', region: { x: 20, y: 35, w: 60, h: 45, label: 'Outsole & Knit Upper Profile' }, excerpt: 'Matches catalog vectors with cosine similarity 0.94' }
      ],
      missingInfo: null,
      followUps: [
        'Check customer reviews and durability ratings',
        'Filter for waterproof shoes only',
        'Compare price across platforms'
      ]
    }
  },

  kitchenmate: {
    id: 'kitchenmate',
    name: 'KitchenMate Recipe & Allergens',
    tag: 'Mode D',
    icon: 'Utensils',
    color: 'amber',
    description: 'Fridge photo ingredient scanner. Flags allergen risks, confirms ambiguous items, and generates step-by-step recipes.',
    disclaimer: 'Culinary suggestions tool. Please inspect all perishables for freshness before consumption.',
    sampleQuery: 'Scan this fridge snapshot, flag any dairy allergens, and suggest a 20-minute dinner.',
    files: [
      { id: 'f-kitch-1', name: 'Fridge_Shelf_Snapshot.jpg', type: 'image', size: '1.8 MB', status: 'Object Detection Complete', meta: 'Photo of refrigerator vegetable and dairy shelf' }
    ],
    answer: {
      text: `**Identified Ingredients:**\n- **Confirmed**: Bell peppers (red & green), Paneer (cottage cheese), Spinach leaves, Tomatoes, Garlic, Greek Yogurt, Olive Oil.\n- **Ambiguous (Please verify)**: Small container on top shelf appears to be ginger paste or hummus.\n\n⚠️ **Allergen Alert**: Contains **Dairy** (Paneer, Greek Yogurt). If lactose intolerant, substitute paneer with firm tofu and yogurt with coconut cream.\n\n🍳 **Recommended Recipe: Quick Garlic-Tossed Paneer & Spinach Stir-Fry (18 Mins)**\n1. Cube 200g paneer and sear in 1 tbsp olive oil until golden.\n2. Sauté minced garlic and sliced bell peppers on high heat for 3 minutes.\n3. Add fresh spinach until just wilted; season with salt, crushed black pepper, and chili flakes.\n4. Garnish with a dollop of yogurt or lemon juice and serve hot!`,
      confidence: 0.95,
      latencyMs: 278,
      citations: [
        { file: 'Fridge_Shelf_Snapshot.jpg', type: 'image', region: { x: 25, y: 40, w: 45, h: 35, label: 'Vegetable Crisper & Dairy Shelf' }, excerpt: 'Detected 7 food bounding boxes with >0.85 IOU' }
      ],
      missingInfo: 'Confirm whether top-shelf container is ginger paste or sesame dip.',
      followUps: [
        'Generate calorie breakdown for this meal',
        'Suggest a 100% vegan substitution',
        'Create a shopping list for missing spices'
      ]
    }
  },

  healthlens: {
    id: 'healthlens',
    name: 'HealthLens Clinical Assistant',
    tag: 'Mode E (Clinical Decision Support)',
    icon: 'Activity',
    color: 'rose',
    description: 'Clinical decision-support tool. Cross-references patient history PDFs, chest X-rays, and doctor voice memos with attention bounding boxes.',
    disclaimer: 'DECISION-SUPPORT TOOL ONLY — NOT A DIAGNOSIS. Requires review by a qualified medical professional / radiologist.',
    sampleQuery: 'Analyze patient history PDF, chest X-ray image, and physician voice memo.',
    files: [
      { id: 'f-hl-1', name: 'Patient_EHR_Summary.pdf', type: 'pdf', size: '1.1 MB', status: 'Medical Lexicon Indexed', pages: 3, meta: '58-year-old male with persistent dry cough' },
      { id: 'f-hl-2', name: 'Chest_PA_Radiograph.png', type: 'image', size: '4.2 MB', status: 'DICOM/Radiology Grayscale Norm', meta: 'Posterior-anterior chest X-ray' },
      { id: 'f-hl-3', name: 'Doctor_Voice_Dictation.mp3', type: 'audio', size: '3.6 MB', status: 'Clinical Audio Transcribed', duration: '01:18', meta: 'Attending physician auscultation observations' },
    ],
    answer: {
      text: `**Clinical Decision Support Synthesis (HealthLens):**\n\n*DISCLAIMER: Decision-support tool, not a diagnosis. Requires review by a qualified medical professional.*\n\n1. **Patient Profile (PDF Page 1)**: 58-year-old male with 3-week history of worsening exertional dyspnea and non-productive cough. No prior history of COPD; non-smoker.\n2. **Auscultation Notes (Audio Dictation at 00:32)**: Attending physician notes bilateral basal inspiratory crackles, more pronounced over the right lower hemithorax.\n3. **Radiological Observations (Chest X-Ray)**:\n   - Increased reticular markings and focal patchy opacity noted in the right lower lung zone.\n   - Costophrenic angles remain sharp; cardiothoracic ratio is within normal physiological limits (CTR < 0.50).\n   - Bounding box placed on right basal zone **for radiologist attention**.\n4. **Recommended Next Steps for Physician Review**:\n   - High-Resolution Computed Tomography (HRCT) of chest.\n   - Complete blood count with inflammatory markers (CRP, ESR).\n   - Pulmonary function testing (spirometry).`,
      confidence: 0.89,
      latencyMs: 385,
      citations: [
        { file: 'Patient_EHR_Summary.pdf', type: 'pdf', page: 1, excerpt: 'Patient reports 3-week progressive dyspnea with night sweats; vitals: SpO2 95% on room air.' },
        { file: 'Doctor_Voice_Dictation.mp3', type: 'audio', timestamp: '00:32', excerpt: '[Attending]: "Crackles audible in right lower lung field upon deep inspiration."' },
        { file: 'Chest_PA_Radiograph.png', type: 'image', region: { x: 52, y: 56, w: 28, h: 26, label: 'Right Lower Zone Patchy Opacity (Attention Region)' }, excerpt: 'Focal density requiring radiologist confirmation.' }
      ],
      missingInfo: 'Previous baseline chest radiograph from 2024 is pending hospital record transfer.',
      followUps: [
        'Export structured clinical summary as PDF for attending physician',
        'Compare right vs left hemithorax radiodensity',
        'List differential considerations for community-acquired pneumonia vs interstitial changes'
      ]
    }
  },

  roadsense: {
    id: 'roadsense',
    name: 'RoadSense Traffic & Siren Simulator',
    tag: 'Mode F (Simulation Only)',
    icon: 'Car',
    color: 'blue',
    description: 'Road safety simulation. Analyzes dashcam video for traffic signs, pedestrians, and vehicles, correlated with emergency siren acoustic detection.',
    disclaimer: 'SAFETY SIMULATION SYSTEM ONLY — Not for autonomous vehicle driving control or active collision prevention.',
    sampleQuery: 'Review dashcam video and siren audio to detect pedestrian crossing and approaching emergency vehicle.',
    files: [
      { id: 'f-road-1', name: 'Dashcam_Intersection_1080p.mp4', type: 'video', size: '22.0 MB', status: 'Vision Object Tracker Ready', duration: '00:45', meta: 'Urban junction with traffic signals and crosswalk' },
      { id: 'f-road-2', name: 'Acoustic_Siren_Track.wav', type: 'audio', size: '5.2 MB', status: 'Doppler Frequency Analyzed', duration: '00:45', meta: 'Multi-channel cabin acoustic stream' },
    ],
    answer: {
      text: `**RoadSense Environmental Simulation Telemetry:**\n\n*DISCLAIMER: Simulation only, not real vehicle control.*\n\n- **Acoustic Event (Audio 00:18)**: High-priority acoustic siren detected (Doppler frequency shift between 650Hz–950Hz indicating approaching emergency ambulance from rear-right quadrant).\n- **Visual Detection (Video 00:24)**: Approaching white emergency vehicle visible in right-hand side mirror with flashing beacon.\n- **Pedestrian Crossing (Video 00:12)**: Two pedestrians detected traversing zebra crossing; speed advised to 0 km/h until crosswalk clears.\n- **Traffic Sign Recognition (Video 00:05)**: Octagonal "STOP" sign recognized at 28-meter distance with 98% confidence.\n\n🛡️ **Simulated Driver Advisory**: Safely yield lane to the left-hand shoulder and bring vehicle to a controlled stop to facilitate emergency corridor clearance.`,
      confidence: 0.94,
      latencyMs: 295,
      citations: [
        { file: 'Acoustic_Siren_Track.wav', type: 'audio', timestamp: '00:18', excerpt: 'Peak acoustic power at 850 Hz: Priority 1 ambulance siren detected.' },
        { file: 'Dashcam_Intersection_1080p.mp4', type: 'video', timestamp: '00:12', region: { x: 38, y: 55, w: 22, h: 32, label: 'Pedestrians on Crosswalk' }, excerpt: 'Object class: Pedestrian (2 instances, trajectory crossing left-to-right).' },
        { file: 'Dashcam_Intersection_1080p.mp4', type: 'video', timestamp: '00:24', region: { x: 72, y: 35, w: 24, h: 25, label: 'Emergency Vehicle Flashing Beacon' }, excerpt: 'Object class: Ambulance with active optical strobe.' }
      ],
      missingInfo: null,
      followUps: [
        'Calculate recommended stopping distance under wet road conditions',
        'Plot Doppler audio frequency waterfall chart',
        'Simulate alternate yield maneuver for multi-lane expressway'
      ]
    }
  },

  cybershield: {
    id: 'cybershield',
    name: 'CyberShield Incident Forensics',
    tag: 'Live Case deb3579d',
    icon: 'ShieldAlert',
    color: 'red',
    description: 'Multimodal forensic cross-examination connecting forged CBI summons PDFs, threatening extortion audio calls, and fraudulent UPI payment QRs.',
    disclaimer: 'OFFICIAL INCIDENT DOSSIER deb3579d-db10-4382-b21c-b550ea6552ec. Synchronized with 1930 / I4C Cybercrime framework.',
    sampleQuery: 'Cross-examine the fake arrest notice PDF, WhatsApp voice extortion memo, and UPI QR demand to identify suspect entities and calculate risk.',
    files: [
      { id: 'f-cs-1', name: 'Digital_Arrest_Notice.pdf', type: 'pdf', size: '1.4 MB', status: 'Forged Letterhead & FIR Analyzed', pages: 2, meta: 'Fake CBI arrest warrant and verification bond demand' },
      { id: 'f-cs-2', name: 'Threatening_Call_Audio.mp3', type: 'audio', size: '3.8 MB', status: 'Whisper Transcribed', duration: '01:24', meta: 'Coercive digital arrest call demanding immediate UPI transfer' },
      { id: 'f-cs-3', name: 'Fraudulent_UPI_QR_Demand.png', type: 'image', size: '820 KB', status: 'Impersonated UPI QR Handle', meta: 'Mule account payment screenshot with suspicious handle' }
    ],
    answer: {
      text: `**Cross-Modal Forensic Incident Analysis (Case deb3579d):**\n\n- **Forensic Verdict**: **HIGH-RISK SCAM (Composite Risk: 92/100)**\n- **Identified Modus Operandi**: Digital Arrest & Law Enforcement Impersonation\n\n**Cross-Modal Evidence Synthesis:**\n1. **Forged Central Warrant (PDF Notice)**: Fabricated emblem claiming urgent detention under Section 66 of IT Act unless a "security guarantee bond" is deposited immediately.\n2. **Coercive Voice Extortion (Threat Audio)**: Voice analysis reveals acoustic coercion patterns and background noise consistent with call centers. Perpetrator commands victim not to disconnect or seek counsel.\n3. **Mule Payment Demand (UPI Screenshot)**: Demands payment to \`cbi.investigation@okaxis\`. Bank lookup confirms this handle resolves to an unauthorized individual account, not an official government escrow.\n\n⚠️ **Action Required**: File complaint on cybercrime.gov.in and call National Cybercrime Helpline 1930 immediately.`,
      confidence: 0.98,
      latencyMs: 180,
      citations: [
        { file: 'Digital_Arrest_Notice.pdf', type: 'pdf', page: 1, excerpt: 'NOTICE: Transfer Rs 50,000 security deposit to avoid immediate custody under IT Act Section 66.' },
        { file: 'Threatening_Call_Audio.mp3', type: 'audio', timestamp: '00:14', excerpt: '[Caller]: "If you disconnect this call, local police will arrive at your address within 15 minutes."' },
        { file: 'Fraudulent_UPI_QR_Demand.png', type: 'image', region: { x: 15, y: 20, w: 70, h: 50, label: 'Mule UPI VPA Handle' }, excerpt: 'Resolves to cbi.investigation@okaxis (Flagged mule account)' }
      ],
      missingInfo: null,
      followUps: [
        'Open the full case dossier with reconstructed timeline and entity graph',
        'Generate official 1930 Cybercrime complaint draft',
        'Export sanitized public awareness alert for social media'
      ]
    }
  }
};

// GET /api/omnimind/modes
async function getModes(req, res) {
  res.json({
    modes: Object.values(MODES).map(m => ({
      id: m.id,
      name: m.name,
      tag: m.tag,
      description: m.description,
      disclaimer: m.disclaimer,
      fileCount: m.files.length,
      sampleQuery: m.sampleQuery,
    }))
  });
}

// GET /api/omnimind/mode/:modeId
async function getModeDetails(req, res) {
  const mode = MODES[req.params.modeId] || MODES.learnable;
  res.json({ mode });
}

// POST /api/omnimind/ask
async function askOmniMind(req, res) {
  const { modeId, query, language } = req.body;
  const start = Date.now();
  const mode = MODES[modeId] || MODES.learnable;

  // Simulate multimodal retrieval latency
  await new Promise(r => setTimeout(r, 220));

  const latencyMs = Date.now() - start;

  res.json({
    modeId: mode.id,
    query: query || mode.sampleQuery,
    language: language || 'en',
    answer: mode.answer.text,
    citations: mode.answer.citations,
    confidence: mode.answer.confidence,
    latencyMs,
    missingInfo: mode.answer.missingInfo,
    followUps: mode.answer.followUps,
  });
}

// POST /api/omnimind/studio
async function generateStudioOutput(req, res) {
  const { modeId, type, difficulty } = req.body;
  const mode = MODES[modeId] || MODES.learnable;

  if (type === 'quiz') {
    return res.json({
      type: 'quiz',
      title: `${mode.name} — Mastery Quiz`,
      questions: [
        {
          question: modeId === 'learnable' ? 'During which stroke is fuel-air mixture drawn into the cylinder?' : 'What is the primary rule when handling sensitive multimodal inputs?',
          options: ['Compression Stroke', 'Intake Stroke', 'Power Stroke', 'Exhaust Stroke'],
          correctIndex: 1,
          explanation: 'The intake stroke lowers the piston and creates a partial vacuum that draws in charge.'
        },
        {
          question: modeId === 'learnable' ? 'What triggers the power stroke in an Otto-cycle petrol engine?' : 'Why are citations essential in multimodal AI?',
          options: ['High pressure injection only', 'Electric spark ignition from the spark plug', 'Exhaust backpressure', 'Gravity'],
          correctIndex: 1,
          explanation: 'A high-voltage spark ignites the pre-compressed fuel-air mixture right before TDC.'
        },
        {
          question: 'What is the primary benefit of cross-modal citation linking in OmniMind AI?',
          options: ['Makes the answers longer', 'Verifies every claim against exact PDF pages, video frames, or audio timestamps', 'Reduces database size', 'Disables user questioning'],
          correctIndex: 1,
          explanation: 'Grounded citations prevent hallucinations by anchoring facts to source timestamps and page coordinates.'
        },
        {
          question: modeId === 'healthlens' ? 'What does the HealthLens clinical disclaimer state?' : 'What should be done when an emergency siren is acoustically detected?',
          options: ['It provides an automated final diagnosis', 'Decision-support tool only, requires licensed physician review', 'It replaces hospital visits', 'No confirmation needed'],
          correctIndex: 1,
          explanation: 'All clinical AI outputs must serve solely as decision support under qualified human medical oversight.'
        }
      ]
    });
  }

  if (type === 'flashcards') {
    return res.json({
      type: 'flashcards',
      title: `${mode.name} Revision Flashcards`,
      cards: [
        { front: 'Intake Stroke Mechanism', back: 'Piston descends from TDC to BDC; inlet valve open; draws fresh charge.' },
        { front: 'Compression Ratio Impact', back: 'Higher compression increases thermal efficiency, limited by fuel knock limits.' },
        { front: 'Cross-Modal Grounding', back: 'Aligning audio acoustic waves with image bounding boxes and PDF document text.' },
        { front: 'Power Stroke Physics', back: 'Rapid combustion pressure exerts maximum downward thrust onto the crankshaft.' },
      ]
    });
  }

  if (type === 'diagram') {
    return res.json({
      type: 'diagram',
      title: `${mode.name} Structural Component Breakdown`,
      components: [
        { name: 'Cylinder Block & Bore', role: 'Main pressure vessel guiding reciprocating piston motion.' },
        { name: 'Intake & Exhaust Poppet Valves', role: 'Camshaft-actuated gas exchange ports with precision sealing.' },
        { name: 'Spark Plug / Ignition Coil', role: 'Delivers 20kV electrical discharge at optimal advance timing.' },
        { name: 'Piston & Connecting Rod', role: 'Translates linear gas expansion forces into rotating crankshaft torque.' },
      ]
    });
  }

  // Default summary
  res.json({
    type: 'summary',
    title: `${mode.name} Executive Synthesis`,
    summary: `OmniMind AI completed unified cross-modal indexing across ${mode.files.length} heterogeneous source files. Extracted textual, acoustic, and spatial features with 0.95 average confidence rating. All claims are linked to interactive citations.`
  });
}

module.exports = {
  getModes,
  getModeDetails,
  askOmniMind,
  generateStudioOutput,
};
