/**
 * Demo Mode Mock Engine for VoxAI.
 * Activates when GEMINI_API_KEY is not configured or in offline simulation.
 * Clearly labels all outputs with `[DEMO MODE]` so mock responses are never presented as real.
 */

export function getMockChatReply(userMessage: string, language: string = 'en'): string {
  const msgLower = userMessage.toLowerCase();

  if (language === 'te' || msgLower.includes('telugu') || msgLower.includes('తెలుగు')) {
    return `[DEMO MODE - MOCK AI] నమస్కారం! నేను మీ వోక్స్ ఏఐ (VoxAI) భాషా సహాయకుడిని. మీ ప్రశ్న: "${userMessage}". రియల్-టైమ్ సమాధానాల కోసం సర్వర్‌లో Gemini API కీ ని కాన్ఫిగర్ చేయండి.`;
  }

  if (language === 'hi' || msgLower.includes('hindi') || msgLower.includes('नमस्ते')) {
    return `[DEMO MODE - MOCK AI] नमस्ते! मैं आपका VoxAI भाषा सहायक हूँ। आपका संदेश: "${userMessage}". लाइव एआई के लिए कृपया GEMINI_API_KEY कॉन्फ़िगर करें।`;
  }

  if (language === 'es' || msgLower.includes('spanish') || msgLower.includes('hola')) {
    return `[DEMO MODE - MOCK AI] ¡Hola! Soy tu asistente de idiomas VoxAI. Recibí tu consulta: "${userMessage}". Para respuestas reales, configura tu clave API de Gemini.`;
  }

  return `[DEMO MODE - MOCK AI] Hello! I am your VoxAI Language Companion. I received your prompt: "${userMessage}". To experience live generation, please configure your GEMINI_API_KEY in .env.local.`;
}

export function getMockTranslation(
  text: string,
  sourceLang: string,
  targetLang: string,
  style: string = 'normal'
): { translatedText: string; detectedLang: string } {
  const dictionary: Record<string, Record<string, string>> = {
    hello: {
      te: 'నమస్కారం',
      hi: 'नमस्ते',
      es: 'Hola',
      fr: 'Bonjour',
      de: 'Hallo',
      ja: 'こんにちは',
      zh: '你好',
      ar: 'مرحبا',
    },
    'how are you': {
      te: 'మీరు ఎలా ఉన్నారు?',
      hi: 'आप कैसे हैं?',
      es: '¿Cómo estás?',
      fr: 'Comment allez-vous ?',
      de: 'Wie geht es Ihnen?',
      ja: 'お元気ですか？',
      zh: '你好吗？',
      ar: 'كيف حالك؟',
    },
    'thank you': {
      te: 'ధన్యవాదాలు',
      hi: 'धन्यवाद',
      es: 'Gracias',
      fr: 'Merci',
      de: 'Danke',
      ja: 'ありがとうございます',
      zh: '谢谢',
      ar: 'شكرا لك',
    },
    'break language barriers with ai': {
      te: 'AI తో భాషా అవరోధాలను అధిగమించండి',
      hi: 'एआई के साथ भाषा की बाधाओं को तोड़ें',
      es: 'Rompe las barreras del idioma con IA',
      fr: 'Brisez les barrières linguistiques avec l\'IA',
      de: 'Überwinden Sie Sprachbarrieren mit KI',
      ja: 'AIで言語の壁を打ち破る',
      zh: '利用人工智能打破语言障碍',
      ar: 'اكسر حواجز اللغة باستخدام الذكاء الاصطناعي',
    },
  };

  const clean = text.trim().toLowerCase();
  const directMatch = dictionary[clean]?.[targetLang];

  if (directMatch) {
    return {
      translatedText: directMatch,
      detectedLang: sourceLang === 'auto' ? 'en' : sourceLang,
    };
  }

  // Generic mock translation with clear label
  return {
    translatedText: `[DEMO TRANSLATION to ${targetLang.toUpperCase()} (${style})]: ${text}`,
    detectedLang: sourceLang === 'auto' ? 'en' : sourceLang,
  };
}

export function getMockTranscription(language: string = 'en-US'): string {
  return `[DEMO MODE - MOCK TRANSCRIPT] Hello, welcome to VoxAI. This is a simulated transcription for test environments.`;
}
