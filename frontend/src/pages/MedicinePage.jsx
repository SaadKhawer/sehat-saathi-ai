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

export default function MedicinePage() {
  const { lang } = useLang();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const quickMeds = ['Panadol', 'Augmentin', 'ORS', 'Flagyl', 'Brufen', 'Metformin', 'Disprin', 'Amoxicillin'];

  const search = async (name) => {
    const med = name || query.trim();
    if (!med) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await aiAPI.medicineInfo(med);
      setResult(parseAIJson(res.data?.data));
    } catch { setResult({ raw: 'Backend se response nahi aaya. Dobara koshish karein.' }); }
    setLoading(false);
  };

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: 'linear-gradient(135deg, #4a3580, #7c5cbf)' }}>
        <h2>💊 {lang === 'ur' ? 'دوائی کی معلومات' : 'Medicine Info'}</h2>
        <p>{lang === 'ur' ? 'دوائی کے بارے میں جانیں — قیمت، استعمال، متبادل' : 'Search medicine usage, price & alternatives'}</p>
      </div>

      {/* Search */}
      <div className="card mb-md">
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" value={query} onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'ur' ? 'دوائی کا نام لکھیں...' : 'Type medicine name...'}
            onKeyDown={e => e.key === 'Enter' && search()} />
          <button className="btn btn-primary" onClick={() => search()} disabled={loading}>
            {loading ? '⏳' : '🔍'}
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {quickMeds.map(m => (
            <span key={m} className="pill" style={{ cursor: 'pointer' }}
              onClick={() => { setQuery(m); search(m); }}>{m}</span>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div className="spinner"></div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>AI search kar rahi hai...</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="card animate-slide">
          {/* Fallback raw text */}
          {result.raw && (
            <p style={{ fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{result.raw}</p>
          )}

          {/* Parsed result */}
          {!result.raw && (
            <>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 40 }}>💊</div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary-dark)' }}>{result.name}</h3>
                  {result.nameUrdu && <p className="urdu" style={{ fontSize: 14, color: 'var(--text-muted)' }}>{result.nameUrdu}</p>}
                </div>
                {result.prescriptionRequired != null && (
                  <span className={`badge ${result.prescriptionRequired ? 'badge-red' : 'badge-green'}`} style={{ marginLeft: 'auto' }}>
                    {result.prescriptionRequired ? '✗ Rx Required' : '✓ OTC'}
                  </span>
                )}
              </div>

              {/* Info rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: '🩺 Use / استعمال', value: result.use, sub: result.useUrdu },
                  { label: '💊 Dose / خوراک', value: result.dose },
                  { label: '💰 Price / قیمت', value: result.price, highlight: true },
                ].map((row, i) => row.value && (
                  <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>{row.label}</div>
                    <div style={{ fontSize: 14, fontWeight: row.highlight ? 700 : 400, color: row.highlight ? 'var(--primary-dark)' : 'var(--text)' }}>
                      {row.value}
                    </div>
                    {row.sub && <div className="urdu" style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{row.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {result.warnings?.length > 0 && (
                <div style={{ background: '#fff8e1', border: '1px solid #f0c040', borderRadius: 'var(--radius-sm)', padding: 12, marginTop: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>⚠️ Warnings / احتیاطیں</div>
                  <ul style={{ marginLeft: 16, fontSize: 13 }}>
                    {result.warnings.map((w, i) => <li key={i} style={{ marginBottom: 4 }}>{w}</li>)}
                  </ul>
                  {result.warningsUrdu?.length > 0 && (
                    <div className="urdu" style={{ fontSize: 13, marginTop: 6, color: '#7a6000' }}>
                      {result.warningsUrdu.join(' • ')}
                    </div>
                  )}
                </div>
              )}

              {/* Alternatives */}
              {result.alternatives?.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>💰 Cheaper Alternatives / سستے متبادل</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {result.alternatives.map((a, i) => (
                      <div key={i} className="badge badge-green">
                        {typeof a === 'string' ? a : `${a.name} — ${a.price}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
