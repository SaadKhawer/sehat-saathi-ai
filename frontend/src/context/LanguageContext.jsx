import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
  // Navigation
  dashboard: { en: 'Dashboard', ur: 'ڈیش بورڈ' },
  symptoms: { en: 'Symptoms', ur: 'علامات' },
  emergency: { en: 'Emergency', ur: 'ایمرجنسی' },
  reports: { en: 'Reports', ur: 'رپورٹس' },
  profiles: { en: 'Family', ur: 'خاندان' },
  tracker: { en: 'Tracker', ur: 'ٹریکر' },
  habits: { en: 'Habits', ur: 'عادات' },
  medicine: { en: 'Medicine', ur: 'دوائی' },
  diet: { en: 'Diet', ur: 'غذا' },
  alerts: { en: 'Alerts', ur: 'الرٹس' },
  firstAid: { en: 'First Aid', ur: 'ابتدائی طبی' },
  mental: { en: 'Mental Health', ur: 'ذہنی صحت' },
  trends: { en: 'Trends', ur: 'رجحانات' },
  settings: { en: 'Settings', ur: 'ترتیبات' },
  
  // Common
  welcome: { en: 'Welcome', ur: 'خوش آمدید' },
  search: { en: 'Search', ur: 'تلاش کریں' },
  save: { en: 'Save', ur: 'محفوظ کریں' },
  cancel: { en: 'Cancel', ur: 'منسوخ' },
  loading: { en: 'Loading...', ur: 'لوڈ ہو رہا ہے...' },
  logout: { en: 'Logout', ur: 'لاگ آؤٹ' },
  login: { en: 'Login', ur: 'لاگ ان' },
  signup: { en: 'Sign Up', ur: 'اکاؤنٹ بنائیں' },
  
  // Dashboard
  healthScore: { en: 'Health Risk Score', ur: 'صحت رسک سکور' },
  dailyTip: { en: 'Daily Health Tip', ur: 'روزانہ صحت ٹپ' },
  checkSymptoms: { en: 'Check Symptoms', ur: 'علامات چیک کریں' },
  recentActivity: { en: 'Recent Activity', ur: 'حالیہ سرگرمی' },
  
  // Disclaimer
  disclaimer: { en: 'This is AI advice. Consult a doctor for final diagnosis.', ur: 'یہ AI مشورہ ہے۔ حتمی تشخیص کے لیے ڈاکٹر سے ملیں۔' },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en || key;
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ur' : 'en');

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
