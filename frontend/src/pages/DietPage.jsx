import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { aiAPI } from '../api/axios';

const parseAIJson = (raw) => {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch {}
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return { raw };
};

const mealTimes = [
  { key: 'breakfast', icon: '🌅', label: 'Breakfast', labelUr: 'ناشتا' },
  { key: 'lunch',     icon: '☀️', label: 'Lunch',     labelUr: 'دوپہر' },
  { key: 'dinner',    icon: '🌙', label: 'Dinner',    labelUr: 'رات'   },
  { key: 'snacks',    icon: '🍎', label: 'Snacks',    labelUr: 'ناشتہ' },
];

export default function DietPage() {
  const { lang } = useLang();
  const [condition, setCondition] = useState('');
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(false);

  const conditions = [
    { en: 'Diabetes',              ur: 'شوگر',              icon: '🍬' },
    { en: 'High BP',               ur: 'ہائی بلڈ پریشر',   icon: '❤️' },
    { en: 'Weight Loss',           ur: 'وزن کم کرنا',      icon: '⚖️' },
    { en: 'Anemia',                ur: 'خون کی کمی',        icon: '🩸' },
    { en: 'Gastritis / Acidity',   ur: 'تیزابیت',           icon: '🔥' },
    { en: 'Pregnancy',             ur: 'حمل',               icon: '🤰' },
    { en: 'Cholesterol',           ur: 'کولیسٹرول',         icon: '🫀' },
    { en: 'General Health',        ur: 'عمومی صحت',         icon: '🌿' },
  ];

  const getDiet = async (cond) => {
    const c = cond || condition;
    if (!c) return;
    setCondition(c);
    setLoading(true);
    setDiet(null);
    try {
      const res = await aiAPI.dietSuggestion({ condition: c });
      setDiet(parseAIJson(res.data?.data));
    } catch { setDiet({ raw: 'Backend se response nahi aaya. Dobara koshish karein.' }); }
    setLoading(false);
  };

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: 'linear-gradient(135deg, #7a5000, #f0a500)' }}>
        <h2>🍽️ {lang === 'ur' ? 'غذائی مشورہ' : 'Diet & Nutrition'}</h2>
        <p>{lang === 'ur' ? 'دیسی کھانے — بیماری کے حساب سے' : 'Desi meal plans based on your condition'}</p>
      </div>

      {/* Condition selector */}
      <div className="card mb-md">
        <div className="card-title">🩺 {lang === 'ur' ? 'بیماری منتخب کریں' : 'Select Condition'}</div>
        <div className="grid-4 gap-sm mt-sm">
          {conditions.map(c => (
            <div key={c.en} className="quick-action"
              style={{ border: condition === c.en ? '2px solid var(--primary)' : undefined, padding: 14 }}
              onClick={() => getDiet(c.en)}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{lang === 'ur' ? c.ur : c.en}</span>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div className="spinner"></div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>AI meal plan bana rahi hai...</p>
        </div>
      )}

      {/* Result */}
      {diet && !loading && (
        <div className="animate-slide">

          {/* Raw fallback */}
          {diet.raw && (
            <div className="card"><p style={{ fontSize: 13, lineHeight: 1.8 }}>{diet.raw}</p></div>
          )}

          {!diet.raw && (
            <>
              {/* Meal cards */}
              {diet.meals && (
                <div className="grid-2 gap-md mb-md">
                  {mealTimes.map(({ key, icon, label, labelUr }) => {
                    const meal = diet.meals[key];
                    if (!meal) return null;
                    return (
                      <div key={key} className="card" style={{ borderTop: '3px solid var(--amber-500)' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#b07800', textTransform: 'uppercase', marginBottom: 6 }}>
                          {icon} {lang === 'ur' ? labelUr : label}
                        </div>
                        <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{meal.name}</h4>
                        {meal.nameUrdu && (
                          <p className="urdu" style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{meal.nameUrdu}</p>
                        )}
                        {meal.ingredients?.length > 0 && (
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                            📝 {meal.ingredients.join(', ')}
                          </p>
                        )}
                        {meal.benefit && (
                          <p style={{ fontSize: 12, color: 'var(--green-600)', fontWeight: 600 }}>✅ {meal.benefit}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Avoid */}
              {diet.avoid?.length > 0 && (
                <div className="card mb-md" style={{ borderLeft: '3px solid var(--red-500)' }}>
                  <div className="card-title">🚫 {lang === 'ur' ? 'پرہیز کریں' : 'Foods to Avoid'}</div>
                  <ul style={{ marginLeft: 16, fontSize: 13, marginTop: 8 }}>
                    {diet.avoid.map((a, i) => <li key={i} style={{ padding: '3px 0' }}>{a}</li>)}
                  </ul>
                  {diet.avoidUrdu?.length > 0 && (
                    <ul className="urdu" style={{ marginRight: 16, fontSize: 13, marginTop: 6 }}>
                      {diet.avoidUrdu.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  )}
                </div>
              )}

              {/* Tips */}
              {diet.tips?.length > 0 && (
                <div className="card" style={{ borderLeft: '3px solid var(--green-500)' }}>
                  <div className="card-title">💡 {lang === 'ur' ? 'مشورے' : 'Health Tips'}</div>
                  <ul style={{ marginLeft: 16, fontSize: 13, marginTop: 8 }}>
                    {diet.tips.map((t, i) => <li key={i} style={{ padding: '3px 0' }}>{t}</li>)}
                  </ul>
                  {diet.tipsUrdu?.length > 0 && (
                    <ul className="urdu" style={{ marginRight: 16, fontSize: 13, marginTop: 6 }}>
                      {diet.tipsUrdu.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
