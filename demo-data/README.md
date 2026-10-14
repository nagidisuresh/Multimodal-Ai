# OmniMind AI — Demo Data Assets

This directory contains lightweight, pre-formatted multimodal assets ready for immediate demonstration during hackathon judging and evaluation.

## Files Overview

| File | Type | Mode | Description |
|---|---|---|---|
| `IC_Engines_Chapter4.pdf` | PDF | **LearnAble** | Textbook excerpt on 4-stroke cycle with definitions and equations |
| `Lecture_Four_Strokes_Prof_Rao.wav` | Audio (WAV) | **LearnAble** | 8kHz synthesized audio lecture matching Professor Rao's transcript |
| `Lecture_Four_Strokes_Prof_Rao.txt` | Text / Transcript | **LearnAble** | Full time-coded transcript with key timestamps (`02:15`, `05:20`) |
| `Paracetamol_500mg_Label_OCR.txt` | OCR / Metadata | **VisionVoice** | Pharmaceutical label with dosage, batch, expiry, and warning |
| `Patient_EHR_Summary.txt` | Clinical Notes | **HealthLens** | Patient history, auscultation crackles, and chest X-ray findings |
| `RoadSense_Telemetry_Log.txt` | Telemetry / Audio Log | **RoadSense** | Dashcam object bounding boxes and siren acoustic frequency detection |

## Quick Regeneration
To regenerate or inspect all assets:
```bash
node demo-data/generate_demo_data.js
```
