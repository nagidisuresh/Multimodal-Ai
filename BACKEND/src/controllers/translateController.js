'use strict';

const { callGemini } = require('../services/gemini');

const MOCK_DICTIONARY = {
  hello: {
    te: 'నమస్కారం',
    hi: 'नमस्ते',
    ta: 'வணக்கம்',
    es: 'Hola',
    fr: 'Bonjour',
    de: 'Hallo',
    ja: 'こんにちは',
    zh: '你好',
    ar: 'مرحبا',
    it: 'Ciao',
    pt: 'Olá',
    ru: 'Привет',
    ko: '안녕하세요',
    bn: 'হ্যালো',
  },
  'how are you': {
    te: 'మీరు ఎలా ఉన్నారు?',
    hi: 'आप कैसे हैं?',
    ta: 'நீங்கள் எப்படி இருக்கிறீர்கள்?',
    es: '¿Cómo estás?',
    fr: 'Comment allez-vous ?',
    de: 'Wie geht es Ihnen?',
    ja: 'お元気ですか？',
    zh: '你好吗？',
    ar: 'كيف حالك؟',
    it: 'Come stai?',
    pt: 'Como vai?',
    ru: 'Как дела?',
    ko: '어떻게 지내세요?',
  },
  'thank you': {
    te: 'ధన్యవాదాలు',
    hi: 'धन्यवाद',
    ta: 'நன்றி',
    es: 'Gracias',
    fr: 'Merci',
    de: 'Danke',
    ja: 'ありがとうございます',
    zh: '谢谢',
    ar: 'شكرا لك',
    it: 'Grazie',
    pt: 'Obrigado',
    ru: 'Спасибо',
    ko: '감사합니다',
  },
  'good morning': {
    te: 'శుభోదయం',
    hi: 'सुप्रभात',
    ta: 'காலை வணக்கம்',
    es: 'Buenos días',
    fr: 'Bonjour',
    de: 'Guten Morgen',
    ja: 'おはようございます',
    zh: '早上好',
    ar: 'صباح الخير',
    it: 'Buongiorno',
    pt: 'Bom dia',
    ru: 'Доброе утро',
    ko: '좋은 아침',
  },
  'good night': {
    te: 'శుభరాత్రి',
    hi: 'शुभ रात्रि',
    ta: 'இரவு வணக்கம்',
    es: 'Buenas noches',
    fr: 'Bonne nuit',
    de: 'Gute Nacht',
    ja: 'おやすみなさい',
    zh: '晚安',
    ar: 'تصبح على خير',
    it: 'Buonanotte',
    pt: 'Boa noite',
    ru: 'Спокойной ночи',
    ko: '안녕히 주무세요',
  },
  welcome: {
    te: 'స్వాగతం',
    hi: 'स्वागत हे',
    ta: 'வரவேற்பு',
    es: 'Bienvenido',
    fr: 'Bienvenue',
    de: 'Willkommen',
    ja: 'ようこそ',
    zh: '欢迎',
    ar: 'أهلاً وسهلاً',
    it: 'Benvenuto',
    pt: 'Bem-vindo',
    ru: 'Добро пожаловать',
    ko: '환영합니다',
  },
};

/**
 * Text translation handler
 */
async function translateText(req, res) {
  try {
    const text = req.body.text;
    const sourceLang = req.body.sourceLang || req.body.sourceLanguage || req.body.source || 'auto';
    const targetLang = req.body.targetLang || req.body.targetLanguage || req.body.target;
    const style = req.body.style || req.body.formality || 'normal';

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text to translate is required' });
    }
    if (!targetLang) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    const clean = text.trim().toLowerCase();
    const directMatch = MOCK_DICTIONARY[clean]?.[targetLang];

    const styleGuide = {
      normal: 'natural, fluent, and faithful to original meaning',
      formal: 'formal, respectful, and grammatically precise',
      casual: 'conversational, friendly, and colloquial',
      professional: 'polished, business-appropriate, and professional',
      simple: 'simple language using basic, accessible vocabulary',
    }[style] || 'natural, fluent, and faithful';

    const systemPrompt = `You are a high-precision multilingual translation engine.
Source language: ${sourceLang === 'auto' ? 'Auto-detect' : sourceLang}.
Target language code: ${targetLang}.
Style requirement: ${styleGuide}.

CRITICAL RULES:
1. Preserve original formatting, bullet points, line breaks, names, technical terms, currencies, numbers, and dates.
2. Return ONLY the translated text as plain text. Do NOT add commentary, explanations, greetings, quotes, or notes.
3. If source text is already in the target language, return it accurately without mutation.`;

    try {
      const result = await callGemini(systemPrompt, [{ text: `Text to translate:\n"""\n${text}\n"""` }], false);
      const translated = (typeof result === 'string' ? result : JSON.stringify(result)).trim();

      return res.json({
        translatedText: translated,
        sourceLang,
        targetLang,
        detectedLang: sourceLang === 'auto' ? 'detected' : sourceLang,
        isMock: false,
      });
    } catch (aiErr) {
      console.warn('[Translate AI Warning]:', aiErr.message);
      let fallback = directMatch;
      if (!fallback) {
        const words = text.split(/\s+/);
        const translatedWords = words.map((w) => {
          const cleanW = w.toLowerCase().replace(/[^a-z]/g, '');
          const match = MOCK_DICTIONARY[cleanW]?.[targetLang];
          return match || w;
        });
        if (translatedWords.some((w, idx) => w !== words[idx])) {
          fallback = translatedWords.join(' ');
        } else {
          fallback = `[${targetLang.toUpperCase()}] ${text}`;
        }
      }
      return res.json({
        translatedText: fallback,
        sourceLang,
        targetLang,
        detectedLang: sourceLang === 'auto' ? 'auto' : sourceLang,
        isMock: true,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Translation failed' });
  }
}

/**
 * Voice translation orchestration handler
 */
async function voiceTranslate(req, res) {
  try {
    const text = req.body.text;
    const sourceLang = req.body.sourceLang || req.body.sourceLanguage || req.body.source || 'auto';
    const targetLang = req.body.targetLang || req.body.targetLanguage || req.body.target;
    const speaker = req.body.speaker || 'single';

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Spoken transcript text is required' });
    }
    if (!targetLang) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    const systemPrompt = `You are a real-time conversational voice-to-voice translation engine.
Translate the spoken input into target language code: ${targetLang}.
Source context: ${sourceLang === 'auto' ? 'Auto-detect' : sourceLang}.

RULES:
1. Translate for spoken conversational delivery (natural, fluent, culturally attuned).
2. Preserve meaning, tone, emotion, names, and numbers.
3. Return ONLY the translated spoken text. Zero explanations or notes.`;

    try {
      const result = await callGemini(systemPrompt, [{ text: `Spoken input:\n"""\n${text}\n"""` }], false);
      const translated = (typeof result === 'string' ? result : JSON.stringify(result)).trim();

      return res.json({
        transcript: text,
        translatedText: translated,
        sourceLang,
        targetLang,
        speaker,
        isMock: false,
      });
    } catch (aiErr) {
      const clean = text.trim().toLowerCase();
      const directMatch = MOCK_DICTIONARY[clean]?.[targetLang] || `[Spoken in ${targetLang}]: ${text}`;
      return res.json({
        transcript: text,
        translatedText: directMatch,
        sourceLang,
        targetLang,
        speaker,
        isMock: true,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Voice translation failed' });
  }
}

/**
 * Audio transcription fallback handler
 */
async function transcribeAudio(req, res) {
  try {
    const language = req.body?.language || 'en-US';
    return res.json({
      transcript: 'Hello, this is your spoken audio transcribed with VoxAI speech processing.',
      detectedLanguage: language,
      isMock: true,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Transcription failed' });
  }
}

/**
 * TTS Provider Adapter
 */
async function speechAdapter(req, res) {
  return res.status(501).json({
    code: 'TTS_NOT_CONFIGURED',
    message: 'External Cloud TTS engine is not configured in environment. The client should utilize browser Web SpeechSynthesis.',
    provider: 'browser',
  });
}

module.exports = {
  translateText,
  voiceTranslate,
  transcribeAudio,
  speechAdapter,
};
