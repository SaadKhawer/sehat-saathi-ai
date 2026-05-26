import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { aiAPI } from '../api/axios';

const parseAIJson = (raw) => {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch {}
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return null;
};

const riskColors = { low: 'var(--green-500)', moderate: 'var(--amber-500)', high: 'var(--red-500)', critical: '#9b0000' };

export default function PredictionPage() {
  const { lang } = useLang();
  const [form, setForm] = useState({ age: '', gender: 'Male', symptoms: '', duration: '', existingConditions: '', smoking: false, diabetes: false, bp: false });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!form.symptoms || !form.age) return;
    setLoading(true); setResult(null);
    try {
      const res = await aiAPI.diseaseProbability(
        `Patient: ${form.age} year old ${form.gender}. Symptoms: ${form.symptoms}. Duration: ${form.duration}. ` +
        `Existing conditions: ${[form.diabetes && 'Diabetes', form.bp && 'High BP', form.smoking && 'Smoker', form.existingConditions].filter(Boolean).join(', ') || 'None'}`
      );
      const parsed = parseAIJson(res.data?.data);
      setResult(parsed);
    } catch { setResult(null); }
    setLoading(false);
  };

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563b0)' }}>
        <h2>🧬 {lang === 'ur' ? 'AI بیماری پیشگوئی' : 'AI Disease Prediction'}</h2>
        <p>{lang === 'ur' ? 'اپنی معلومات دیں — AI بیماری کا اندازہ لگائے گا' : 'Enter your health info for AI-powered disease risk prediction'}</p>
      </div>

      <div className="grid-2 gap-md">
        {/* Form */}
        <div className="card">
          <div className="card-title">📋 {lang === 'ur' ? 'مریض کی معلومات' : 'Patient Information'}</div>

          <div className="grid-2 gap-md mt-sm">
            <div className="form-group">
              <label className="label">🎂 {lang === 'ur' ? 'عمر' : 'Age'}</label>
              <input className="input" type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="e.g. 35" min="1" max="120" />
            </div>
            <div className="form-group">
              <label className="label">⚥ {lang === 'ur' ? 'جنس' : 'Gender'}</label>
              <select className="select" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="label">🩺 {lang === 'ur' ? 'علامات (ضروری)' : 'Symptoms (required)'}</label>
            <textarea className="input textarea" value={form.symptoms}
              onChange={e => setForm(f => ({ ...f, symptoms: e.target.value }))}
              placeholder={lang === 'ur' ? 'مثال: بخار، سردرد، تھکاوٹ، کھانسی...' : 'e.g. fever, headache, fatigue, cough...'} />
          </div>

          <div className="form-group">
            <label className="label">⏱️ {lang === 'ur' ? 'کتنے دن سے' : 'Duration'}</label>
            <select className="select" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
              <option value="">Select duration</option>
              <option>1-2 days / 1-2 دن</option>
              <option>3-5 days / 3-5 دن</option>
              <option>1 week / 1 ہفتہ</option>
              <option>2+ weeks / 2+ ہفتے</option>
              <option>1+ month / 1+ مہینہ</option>
            </select>
          </div>

          {/* Risk Factors */}
          <div className="card-title mt-sm">⚠️ {lang === 'ur' ? 'خطرے کے عوامل' : 'Risk Factors'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
            {[
              { key: 'diabetes', label: 'Diabetes 🍬', labelUr: 'شوگر' },
              { key: 'bp', label: 'High BP ❤️', labelUr: 'بی پی' },
              { key: 'smoking', label: 'Smoker 🚬', labelUr: 'سگریٹ' },
            ].map(({ key, label, labelUr }) => (
              <div key={key} onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  border: `2px solid ${form[key] ? 'var(--red-500)' : 'var(--border)'}`,
                  background: form[key] ? 'var(--red-50)' : 'var(--surface)',
                  color: form[key] ? 'var(--red-600)' : 'var(--text-secondary)' }}>
                {lang === 'ur' ? labelUr : label}
              </div>
            ))}
          </div>

          <div className="form-group mt-sm">
            <label className="label">🏥 {lang === 'ur' ? 'موجودہ بیماریاں' : 'Existing Conditions'}</label>
            <input className="input" value={form.existingConditions} onChange={e => setForm(f => ({ ...f, existingConditions: e.target.value }))}
              placeholder={lang === 'ur' ? 'مثال: دل کی بیماری، گردے...' : 'e.g. heart disease, kidney...'} />
          </div>

          <button className="btn btn-primary w-full" onClick={handlePredict} disabled={loading || !form.symptoms || !form.age}>
            {loading ? '⏳ AI Analyzing...' : '🧬 Predict Disease Risk'}
          </button>
        </div>

        {/* Result */}
        <div>
          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div className="spinner"></div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>AI analyzing patient data...</p>
            </div>
          )}

          {result && !loading && (
            <div className="animate-slide">
              {/* Urgency Banner */}
              {result.urgency && (
                <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: 14, fontWeight: 700, fontSize: 14, textAlign: 'center',
                  background: result.urgency === 'emergency' ? '#fee2e2' : result.urgency === 'high' ? '#fff8e1' : '#d1fae5',
                  color: result.urgency === 'emergency' ? '#c00' : result.urgency === 'high' ? '#a16207' : '#065f46',
                  border: `1px solid ${result.urgency === 'emergency' ? '#fca5a5' : result.urgency === 'high' ? '#fde68a' : '#6ee7b7'}` }}>
                  {result.urgency === 'emergency' ? '🚨 EMERGENCY — Go to Hospital NOW!' :
                   result.urgency === 'high' ? '⚠️ High Risk — See Doctor Today' :
                   result.urgency === 'moderate' ? '💛 Moderate — See Doctor Soon' :
                   '✅ Low Risk — Monitor at Home'}
                </div>
              )}

              {/* Disease Bars */}
              <div className="card mb-md">
                <div className="card-title">📊 {lang === 'ur' ? 'ممکنہ بیماریاں' : 'Possible Diseases'}</div>
                <div style={{ marginTop: 12 }}>
                  {result.diseases?.map((d, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>{d.name}</span>
                          {d.nameUrdu && <span className="urdu" style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 8 }}> — {d.nameUrdu}</span>}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: d.probability > 50 ? 'var(--red-500)' : d.probability > 25 ? 'var(--amber-500)' : 'var(--green-500)' }}>
                          {d.probability}%
                        </span>
                      </div>
                      {d.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{d.description}</p>}
                      <div style={{ background: 'var(--bg)', borderRadius: 6, height: 8 }}>
                        <div style={{ width: `${d.probability}%`, height: '100%', borderRadius: 6, transition: 'width 0.8s ease',
                          background: d.probability > 50 ? 'var(--red-500)' : d.probability > 25 ? 'var(--amber-500)' : 'var(--green-500)' }} />
                      </div>
                      <span className={`badge ${d.severity === 'severe' ? 'badge-red' : d.severity === 'moderate' ? 'badge-amber' : 'badge-green'}`} style={{ marginTop: 4 }}>
                        {d.severity || 'mild'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Tests */}
              {result.recommendedTests?.length > 0 && (
                <div className="card">
                  <div className="card-title">🔬 {lang === 'ur' ? 'تجویز کردہ ٹیسٹ' : 'Recommended Tests'}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {result.recommendedTests.map((t, i) => <span key={i} className="pill">{t}</span>)}
                  </div>
                  {result.recommendedTestsUrdu?.length > 0 && (
                    <div className="urdu" style={{ fontSize: 13, marginTop: 8, color: 'var(--text-muted)' }}>
                      {result.recommendedTestsUrdu.join(' · ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🧬</div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Fill the form and click Predict to get AI disease risk analysis</p>
              <p className="urdu" style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>فارم بھریں اور AI سے بیماری کا اندازہ لگوائیں</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
