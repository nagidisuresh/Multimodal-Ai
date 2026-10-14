# VoxAI — Your AI Language Companion: Implementation Plan

## 1. Executive Summary & Architecture
**VoxAI** is a production-ready, full-stack responsive web application engineered with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide React**. It provides a comprehensive AI language ecosystem featuring:
- AI Chatbot with multi-turn streaming context
- Interactive Voice Assistant with animated audio waveforms and Web Speech TTS
- Precision Text Translator across 21+ major world and Indian languages
- Voice-to-Voice Translator with both One-Way and Two-Way (Person A / Person B split-screen) conversation modes
- Voice Transcriber with live editable transcripts and instant translation handoff
- Client-side persistent History & Privacy-centric Settings
- Server-side Route Handlers with Zod validation, Gemini API integration, and resilient Demo Mode fallback

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Client (React)                   │
│  - Web Speech API (SpeechRecognition STT / SpeechSynthesis) │
│  - MediaRecorder (Audio Blob capture fallback)              │
│  - LocalStorage (Chats, Translations, Transcripts)          │
│  - Lucide Icons + Tailwind Glassmorphism                    │
└──────────────┬──────────────────────────────▲───────────────┘
               │ (HTTPS JSON / Streams)        │
┌──────────────▼──────────────────────────────┴───────────────┐
│               Next.js 15 Server Route Handlers              │
│  - Zod Request Validation & Body Size Protection            │
│  - Token-Bucket In-Memory Rate Limiting                     │
│  - Official @google/genai SDK Orchestration                 │
│  - Demo Mode Mock Engine (activates if key not set)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────▼───────────────┐
               │    Google Gemini API / Cloud  │
               │  (gemini-1.5-flash / configured) │
               └───────────────────────────────┘
```

---

## 2. Directory Structure (`voxai/`)
```
voxai/
├── app/
│   ├── layout.tsx              # Root layout with Sidebar, ThemeProvider, Toast
│   ├── page.tsx                # Home / Landing dashboard
│   ├── globals.css             # Tailwind design tokens, animations, scrollbars
│   ├── chat/page.tsx           # Multi-turn streaming AI chatbot
│   ├── voice-assistant/page.tsx# Tap-to-talk voice assistant with waveforms
│   ├── translate/page.tsx      # Text translator with tone & 21+ languages
│   ├── voice-translator/page.tsx # One-way & Two-way split conversation
│   ├── transcribe/page.tsx     # Voice transcriber with live edit & export
│   ├── history/page.tsx        # Searchable unified history vault
│   ├── settings/page.tsx       # User preferences, speech controls, privacy
│   └── api/
│       ├── chat/route.ts       # POST: streaming multi-turn chat
│       ├── translate/route.ts  # POST: tone-aware translation
│       ├── transcribe/route.ts # POST: audio buffer -> Gemini transcription
│       ├── speech/route.ts     # POST: modular TTS adapter
│       ├── voice-translate/route.ts # POST: pipeline orchestration
│       └── health/route.ts     # GET: health & API connectivity probe
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Fixed desktop navigation sidebar
│   │   ├── MobileNav.tsx       # Mobile bottom navigation bar
│   │   └── Header.tsx          # Responsive top bar with theme & status
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── TextArea.tsx
│   │   ├── Select.tsx
│   │   ├── Toast.tsx
│   │   └── WaveformIndicator.tsx # Animated audio sound wave
│   └── shared/
│       ├── LanguageSelector.tsx
│       └── ErrorBanner.tsx
├── lib/
│   ├── gemini.ts               # Google GenAI client & model initialization
│   ├── languages.ts            # 21+ supported languages metadata & BCP-47 codes
│   ├── rateLimit.ts            # In-memory sliding rate limiter
│   ├── mockEngine.ts           # Demo fallback generator for offline testing
│   ├── storage.ts              # LocalStorage wrapper with schema migrations
│   └── ttsAdapter.ts           # Modular speech synthesis provider interface
├── hooks/
│   ├── useSpeechRecognition.ts # Web Speech API STT hook with permission handling
│   ├── useSpeechSynthesis.ts   # Web Speech API TTS hook with voice selection
│   ├── useMediaRecorder.ts     # Raw audio recording for server fallback
│   └── useLocalHistory.ts      # Unified history manager
├── types/
│   ├── api.ts                  # Zod schemas & TypeScript API interfaces
│   └── history.ts              # Data types for saved transcripts/translations
├── tests/
│   ├── languages.test.ts
│   ├── rateLimit.test.ts
│   └── validation.test.ts
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vitest.config.ts
```

---

## 3. Supported Languages
The application supports 22 core international and regional languages:
- English (`en-US`)
- Telugu (`te-IN`)
- Hindi (`hi-IN`)
- Tamil (`ta-IN`)
- Kannada (`kn-IN`)
- Malayalam (`ml-IN`)
- Bengali (`bn-IN`)
- Marathi (`mr-IN`)
- Gujarati (`gu-IN`)
- Punjabi (`pa-IN`)
- Urdu (`ur-PK`)
- Spanish (`es-ES`)
- French (`fr-FR`)
- German (`de-DE`)
- Portuguese (`pt-PT`)
- Arabic (`ar-SA`)
- Chinese Simplified (`zh-CN`)
- Japanese (`ja-JP`)
- Korean (`ko-KR`)
- Russian (`ru-RU`)
- Italian (`it-IT`)

---

## 4. API Endpoints & Request Specifications

### 1. `POST /api/chat`
- **Payload**: `{ messages: [{ role: 'user' | 'model', content: string }], mode?: string, language?: string }`
- **Output**: Streaming text (`Transfer-Encoding: chunked` / SSE / ReadableStream)
- **Validation**: Minimum 1 message, maximum 20 context turns, 4000 char per turn.

### 2. `POST /api/translate`
- **Payload**: `{ text: string, sourceLang: string, targetLang: string, style?: 'normal'|'formal'|'casual'|'professional'|'simple' }`
- **Output**: `{ translatedText: string, detectedLang?: string }`
- **Rules**: Zero commentary, retains formatting, handles names & numbers gracefully.

### 3. `POST /api/transcribe`
- **Payload**: `FormData` with `audio` (audio/webm, audio/wav, audio/mp4, audio/mpeg <= 10MB) + `language`
- **Output**: `{ transcript: string, detectedLanguage?: string }`
- **Fallback**: Transcribes audio using Gemini multimodal audio analysis.

### 4. `POST /api/voice-translate`
- **Payload**: `FormData` or JSON: `{ text?: string, audioBase64?: string, sourceLang: string, targetLang: string }`
- **Output**: `{ transcript: string, translatedText: string }`

### 5. `POST /api/speech`
- **Payload**: `{ text: string, language: string }`
- **Output**: Returns status 501 / 400 with `"NOT_CONFIGURED"`, cleanly prompting the client to use the high-fidelity browser `window.speechSynthesis` adapter.

### 6. `GET /api/health`
- **Output**: `{ status: 'ok', timestamp: string, geminiConfigured: boolean, model: string }`

---

## 5. Security & Risk Management
1. **API Key Isolation**: `GEMINI_API_KEY` is loaded strictly on the server and never exposed via `NEXT_PUBLIC_`.
2. **Graceful Demo Mode**: If no API key is supplied or quota is exceeded, the server automatically provides labeled Demo Mode responses so the app remains 100% interactive and testable.
3. **Payload Protection**: Zod schemas enforce size limits (10,000 characters text, 10MB audio).
4. **Privacy First**: No raw audio recordings are stored server-side. Mic access is triggered only by explicit user interaction.

---

## 6. Verification & Quality Assurance Strategy
1. **Compilation**: `npx tsc --noEmit` ensures zero TypeScript errors.
2. **Linting & Formatting**: Clean code validation.
3. **Unit Tests**: Vitest suite verifying language registry, rate limiting, and Zod validators.
4. **Production Build**: `npm run build` generates optimized Next.js server bundle.
5. **Interactive Browser Testing**: Browser subagent validates all routes at desktop (1280px) and mobile (390px) viewports.
