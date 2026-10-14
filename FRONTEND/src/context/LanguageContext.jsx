import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appTitle: 'OmniMind AI',
    tagline: 'One Input. Every Insight.',
    dashboard: 'Dashboard',
    cases: 'Cases',
    myFiles: 'My Files',
    search: 'Search',
    learn: 'Learn Mode',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    newCase: 'New Case',
    totalCases: 'Total Cases',
    totalEvidence: 'Total Evidence Files',
    highRisk: 'High Risk / Scams',
    safe: 'Verified Safe',
    pending: 'Analyzing / Pending',
    evidenceTab: 'Evidence Files',
    summaryTab: 'Case Summary',
    askAiTab: 'Ask AI Analyst',
    complaintTab: 'Complaint Generator',
    contentStudioTab: 'Content Studio',
    learnTab: 'Learn Attack Flow',
    uploadPrompt: 'Drag and drop screenshots, PDFs, audio (MP3/WAV), video (MP4) or paste text & phishing links',
    disclaimer: 'AI guidance only. Not legal advice. For immediate financial fraud recovery, dial 1930 or visit cybercrime.gov.in',
  },
  te: {
    appTitle: 'OmniMind AI',
    tagline: 'ఒకే ఇన్‌పుట్. ప్రతి అంతర్దృష్టి.',
    dashboard: 'డ్యాష్‌బోర్డ్',
    cases: 'కేసులు',
    myFiles: 'నా ఫైళ్లు',
    search: 'వెతుకు',
    learn: 'నేర్చుకోండి',
    login: 'లాగిన్',
    register: 'ఖాతా తెరవండి',
    logout: 'లాగౌట్',
    newCase: 'కొత్త కేసు',
    totalCases: 'మొత్తం కేసులు',
    totalEvidence: 'ఆధార పత్రాలు',
    highRisk: 'అధిక ప్రమాదం / మోసం',
    safe: 'సురక్షితం',
    pending: 'విశ్లేషణలో ఉంది',
    evidenceTab: 'ఆధారాలు',
    summaryTab: 'కేసు సారాంశం',
    askAiTab: 'AI విశ్లేషకుడిని అడగండి',
    complaintTab: 'ఫిర్యాదు పత్రం',
    contentStudioTab: 'కంటెంట్ స్టూడియో',
    learnTab: 'మోసం విధానం నేర్చుకోండి',
    uploadPrompt: 'స్క్రీన్‌షాట్లు, PDFలు, ఆడియో, వీడియోలు లేదా లింకులను ఇక్కడ అప్‌లోడ్ చేయండి',
    disclaimer: 'ఇది కేవలం AI మార్గదర్శకత్వం మాత్రమే. చట్టపరమైన సలహా కాదు. తక్షణ ఆర్థిక మోసం సహాయానికి 1930 కు కాల్ చేయండి లేదా cybercrime.gov.in ని సందర్శించండి',
  },
  hi: {
    appTitle: 'OmniMind AI',
    tagline: 'एक इनपुट। हर अंतर्दृष्टि।',
    dashboard: 'डैशबोर्ड',
    cases: 'केस',
    myFiles: 'मेरी फ़ाइलें',
    search: 'खोजें',
    learn: 'सीखें',
    login: 'लॉग इन',
    register: 'पंजीकरण',
    logout: 'लॉग आउट',
    newCase: 'नया केस',
    totalCases: 'कुल केस',
    totalEvidence: 'कुल साक्ष्य फाइलें',
    highRisk: 'उच्च जोखिम / धोखाधड़ी',
    safe: 'सुरक्षित सत्यापित',
    pending: 'विश्लेषण प्रगति पर',
    evidenceTab: 'साक्ष्य फाइलें',
    summaryTab: 'केस सारांश',
    askAiTab: 'AI विश्लेषक से पूछें',
    complaintTab: 'शिकायत पत्र',
    contentStudioTab: 'कंटेंट स्टूडियो',
    learnTab: 'हमले का तरीका समझें',
    uploadPrompt: 'स्क्रीनशॉट, पीडीएफ, ऑडियो, वीडियो या लिंक यहां अपलोड करें',
    disclaimer: 'केवल AI मार्गदर्शन। कानूनी सलाह नहीं। वित्तीय धोखाधड़ी की तत्काल रिपोर्ट के लिए 1930 पर कॉल करें या cybercrime.gov.in पर जाएं',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('scamkavach_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('scamkavach_lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
