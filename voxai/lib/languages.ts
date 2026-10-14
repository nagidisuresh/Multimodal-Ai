export interface Language {
  code: string;
  name: string;
  nativeName: string;
  bcp47: string;
  flag: string;
  speechSupport: boolean;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', bcp47: 'en-US', flag: '🇺🇸', speechSupport: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', bcp47: 'te-IN', flag: '🇮🇳', speechSupport: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', bcp47: 'hi-IN', flag: '🇮🇳', speechSupport: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', bcp47: 'ta-IN', flag: '🇮🇳', speechSupport: true },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', bcp47: 'kn-IN', flag: '🇮🇳', speechSupport: true },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', bcp47: 'ml-IN', flag: '🇮🇳', speechSupport: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', bcp47: 'bn-IN', flag: '🇮🇳', speechSupport: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', bcp47: 'mr-IN', flag: '🇮🇳', speechSupport: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', bcp47: 'gu-IN', flag: '🇮🇳', speechSupport: true },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', bcp47: 'pa-IN', flag: '🇮🇳', speechSupport: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', bcp47: 'ur-PK', flag: '🇵🇰', speechSupport: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', bcp47: 'es-ES', flag: '🇪🇸', speechSupport: true },
  { code: 'fr', name: 'French', nativeName: 'Français', bcp47: 'fr-FR', flag: '🇫🇷', speechSupport: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', bcp47: 'de-DE', flag: '🇩🇪', speechSupport: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', bcp47: 'pt-PT', flag: '🇵🇹', speechSupport: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', bcp47: 'ar-SA', flag: '🇸🇦', speechSupport: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', bcp47: 'zh-CN', flag: '🇨🇳', speechSupport: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', bcp47: 'ja-JP', flag: '🇯🇵', speechSupport: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', bcp47: 'ko-KR', flag: '🇰🇷', speechSupport: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', bcp47: 'ru-RU', flag: '🇷🇺', speechSupport: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', bcp47: 'it-IT', flag: '🇮🇹', speechSupport: true },
];

export const AUTO_DETECT_OPTION: Language = {
  code: 'auto',
  name: 'Auto-detect',
  nativeName: 'Auto-detect',
  bcp47: 'en-US',
  flag: '🌐',
  speechSupport: false,
};

export function getLanguageByCode(code: string): Language {
  if (code === 'auto') return AUTO_DETECT_OPTION;
  const found = LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase());
  return found || LANGUAGES[0];
}

export function getBCP47(code: string): string {
  const lang = getLanguageByCode(code);
  return lang.bcp47;
}
