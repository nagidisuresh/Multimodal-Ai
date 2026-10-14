'use strict';

const fs = require('fs');
const path = require('path');

const DEMO_DIR = path.join(__dirname);

// 1. Generate valid minimal PDF (IC Engines Chapter 4 Excerpt)
function createSamplePDF() {
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 280 >>
stream
BT
/F1 18 Tf
50 720 Td
(OmniMind AI: Internal Combustion Engines - Chapter 4) Tj
/F1 12 Tf
0 -40 Td
(Section 4.1: Four-Stroke Working Cycle) Tj
0 -25 Td
(1. Intake Stroke: Piston descends from TDC to BDC creating negative pressure.) Tj
0 -20 Td
(2. Compression Stroke: Valves seal tightly; fuel-air charge compressed ~10:1.) Tj
0 -20 Td
(3. Power Stroke: Spark discharge right before TDC initiates combustion.) Tj
0 -20 Td
(4. Exhaust Stroke: Exhaust valve opens as piston ascends, expelling gas.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000565 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
634
%%EOF
`;

  fs.writeFileSync(path.join(DEMO_DIR, 'IC_Engines_Chapter4.pdf'), pdfContent);
  console.log('✅ Created IC_Engines_Chapter4.pdf');
}

// 2. Generate valid minimal WAV audio file (1 second sine-wave beep)
function createSampleWAV() {
  const sampleRate = 8000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const durationSeconds = 2;
  const numSamples = sampleRate * durationSeconds;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate 440Hz tone
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * 440 * t) * 16000;
    buffer.writeInt16LE(Math.floor(sample), 44 + i * 2);
  }

  fs.writeFileSync(path.join(DEMO_DIR, 'Lecture_Four_Strokes_Prof_Rao.wav'), buffer);
  console.log('✅ Created Lecture_Four_Strokes_Prof_Rao.wav');
}

// 3. Generate sample labels and transcripts
function createSampleTranscripts() {
  fs.writeFileSync(
    path.join(DEMO_DIR, 'Lecture_Four_Strokes_Prof_Rao.txt'),
    `OmniMind AI Lecture Transcript
Instructor: Prof. K. V. Rao
Course: Advanced Mechanical Systems (AMS-301)
Duration: 08:42

[00:15 - 01:05]
Welcome back everyone. Today we are exploring the internal combustion engine.
Specifically, why four distinct strokes are required to produce usable rotational torque.

[02:15 - 03:00]
"Notice that adiabatic compression heats the charge before the spark triggers.
If compression ratio exceeds 11:1 on standard unleaded fuel, you run the risk of auto-ignition knock.
At 02:15 in your lab diagrams, observe how both intake and exhaust valves remain sealed."

[05:20 - 06:10]
When the spark discharges right before top dead center, rapid chemical deflagration pushes the piston downwards.
This is the only stroke in the cycle that actually generates power.
`
  );

  fs.writeFileSync(
    path.join(DEMO_DIR, 'Paracetamol_500mg_Label_OCR.txt'),
    `VisionVoice OCR Inspection Data:
MEDICATION: PARACETAMOL TABLETS IP 500mg
BATCH: B7492A
EXPIRY: 11/2027
MFG LIC: G/25/1892
DOSAGE: 1 tablet every 6 to 8 hours as prescribed by physician. Maximum 4000mg in 24 hours.
WARNING: Overdose may cause severe liver damage or allergic skin reaction.
STORAGE: Store protected from light and moisture at a temperature not exceeding 30°C.
`
  );

  fs.writeFileSync(
    path.join(DEMO_DIR, 'Patient_EHR_Summary.txt'),
    `HealthLens EHR Record:
Patient ID: HL-58291
Age: 58 | Sex: Male
Chief Complaint: 3-week progressive dyspnea and persistent non-productive cough.
Auscultation: Bilateral basal inspiratory crackles, more pronounced in right lower zone.
Chest X-Ray Findings: Focal patchy alveolar opacification in the right lower lobe.
Disclaimer: Decision-support tool, not a diagnosis. Requires review by a qualified medical professional.
`
  );

  fs.writeFileSync(
    path.join(DEMO_DIR, 'RoadSense_Telemetry_Log.txt'),
    `RoadSense Simulation Telemetry Log:
Time: 00:12 -> Visual: Detected 2 pedestrians crossing at zebra junction (ROI: [38, 55, 22, 32]). Advisory: 0 km/h.
Time: 00:18 -> Acoustic: 850 Hz peak emergency siren acoustic waveform detected from rear-right quadrant.
Time: 00:24 -> Visual: Approaching ambulance emergency strobe verified in right rear mirror.
Advisory: Yield right shoulder lane smoothly.
`
  );

  console.log('✅ Created demo transcripts and metadata files.');
}

createSamplePDF();
createSampleWAV();
createSampleTranscripts();
console.log('🎉 All demo assets generated successfully in demo-data/');
