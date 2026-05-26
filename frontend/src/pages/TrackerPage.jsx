import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

export default function TrackerPage() {
  const { lang } = useLang();
  const [tab, setTab] = useState('bp');
  const [data, setData] = useState({ bp: [], sugar: [], weight: [] });
  const [bpForm, setBpForm] = useState({ sys: '', dia: '' });
  const [sugarForm, setSugarForm] = useState({ val: '', type: 'fasting' });
  const [weightForm, setWeightForm] = useState({ val: '', height: '' });

  const addBP = () => {
    const sys = parseFloat(bpForm.sys), dia = parseFloat(bpForm.dia);
    if (!sys || !dia) return;
    setData(prev => ({ ...prev, bp: [{ sys, dia, time: new Date().toLocaleString() }, ...prev.bp] }));
    setBpForm({ sys: '', dia: '' });
  };

  const addSugar = () => {
    const val = parseFloat(sugarForm.val);
    if (!val) return;
    setData(prev => ({ ...prev, sugar: [{ val, type: sugarForm.type, time: new Date().toLocaleString() }, ...prev.sugar] }));
    setSugarForm({ val: '', type: 'fasting' });
  };

  const addWeight = () => {
    const val = parseFloat(weightForm.val);
    if (!val) return;
    const height = parseFloat(weightForm.height);
    const bmi = height ? (val / ((height / 100) ** 2)).toFixed(1) : null;
    setData(prev => ({ ...prev, weight: [{ val, height, bmi, time: new Date().toLocaleString() }, ...prev.weight] }));
    setWeightForm({ val: '', height: weightForm.height });
  };

  const getStatus = (type, entry) => {
    if (type === 'bp') {
      if (entry.sys <= 120 && entry.dia <= 80) return { label: '✅ Normal', cls: 'badge-green' };
      if (entry.sys >= 140 || entry.dia >= 90) return { label: '🚨 High', cls: 'badge-red' };
      return { label: '⚠️ Elevated', cls: 'badge-amber' };
    }
    if (type === 'sugar') {
      if (entry.type === 'fasting') {
        if (entry.val < 70) return { label: '⬇️ Low', cls: 'badge-amber' };
        if (entry.val <= 99) return { label: '✅ Normal', cls: 'badge-green' };
        if (entry.val <= 125) return { label: '⚠️ Pre-DM', cls: 'badge-amber' };
        return { label: '🚨 High', cls: 'badge-red' };
      }
      if (entry.val <= 140) return { label: '✅ Normal', cls: 'badge-green' };
      if (entry.val <= 200) return { label: '⚠️ Elevated', cls: 'badge-amber' };
      return { label: '🚨 High', cls: 'badge-red' };
    }
    if (type === 'weight' && entry.bmi) {
      if (entry.bmi < 18.5) return { label: '⬇️ Under', cls: 'badge-amber' };
      if (entry.bmi < 25) return { label: '✅ Normal', cls: 'badge-green' };
      if (entry.bmi < 30) return { label: '⚠️ Over', cls: 'badge-amber' };
      return { label: '🚨 Obese', cls: 'badge-red' };
    }
    return { label: '--', cls: 'badge-green' };
  };

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: 'linear-gradient(135deg, #1a4a8a, #3a7bd5)' }}>
        <h2>❤️ {lang === 'ur' ? 'صحت ٹریکر' : 'Health Tracker'}</h2>
        <p>{lang === 'ur' ? 'بی پی، شوگر اور وزن ریکارڈ کریں' : 'Track BP, Blood Sugar & Weight over time'}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[{ k: 'bp', icon: '❤️', label: 'BP' }, { k: 'sugar', icon: '🍬', label: 'Sugar' }, { k: 'weight', icon: '⚖️', label: 'Weight' }].map(t => (
          <button key={t.k} className={`btn ${tab === t.k ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t.k)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* BP */}
      {tab === 'bp' && (
        <div className="card">
          <div className="card-title">❤️ Blood Pressure / بلڈ پریشر</div>
          <div className="card-subtitle">Normal: 90/60 – 120/80 mmHg</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input className="input" type="number" placeholder="Systolic (120)" value={bpForm.sys} onChange={e => setBpForm({...bpForm, sys: e.target.value})} />
            <input className="input" type="number" placeholder="Diastolic (80)" value={bpForm.dia} onChange={e => setBpForm({...bpForm, dia: e.target.value})} />
            <button className="btn btn-primary" onClick={addBP}>+ Add</button>
          </div>
          {data.bp.length > 0 && (
            <div className="grid-3 gap-sm mt-md">
              <div className="stat-card"><div className="stat-value">{data.bp[0].sys}/{data.bp[0].dia}</div><div className="stat-label">Latest</div></div>
              <div className="stat-card"><div className="stat-value">{Math.round(data.bp.slice(0,7).reduce((a,b)=>a+b.sys,0)/Math.min(data.bp.length,7))}</div><div className="stat-label">Avg Sys (7d)</div></div>
              <div className="stat-card"><div className={`stat-value`}><span className={`badge ${getStatus('bp', data.bp[0]).cls}`}>{getStatus('bp', data.bp[0]).label}</span></div><div className="stat-label">Status</div></div>
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            {data.bp.slice(0, 10).map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, marginBottom: 4, fontSize: 13 }}>
                <strong>{e.sys}/{e.dia} mmHg</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{e.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sugar */}
      {tab === 'sugar' && (
        <div className="card">
          <div className="card-title">🍬 Blood Sugar / بلڈ شوگر</div>
          <div className="card-subtitle">Normal fasting: 70-99 mg/dL | After meal: &lt;140</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input className="input" type="number" placeholder="Sugar (mg/dL)" value={sugarForm.val} onChange={e => setSugarForm({...sugarForm, val: e.target.value})} />
            <select className="select" style={{ maxWidth: 140 }} value={sugarForm.type} onChange={e => setSugarForm({...sugarForm, type: e.target.value})}>
              <option value="fasting">Fasting</option><option value="aftermeal">After Meal</option><option value="random">Random</option>
            </select>
            <button className="btn btn-primary" onClick={addSugar}>+ Add</button>
          </div>
          {data.sugar.length > 0 && (
            <div className="grid-3 gap-sm mt-md">
              <div className="stat-card"><div className="stat-value">{data.sugar[0].val}</div><div className="stat-label">Latest (mg/dL)</div></div>
              <div className="stat-card"><div className="stat-value">{Math.round(data.sugar.slice(0,7).reduce((a,b)=>a+b.val,0)/Math.min(data.sugar.length,7))}</div><div className="stat-label">Avg (7d)</div></div>
              <div className="stat-card"><span className={`badge ${getStatus('sugar', data.sugar[0]).cls}`}>{getStatus('sugar', data.sugar[0]).label}</span><div className="stat-label">Status</div></div>
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            {data.sugar.slice(0, 10).map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, marginBottom: 4, fontSize: 13 }}>
                <strong>{e.val} mg/dL <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>({e.type})</span></strong>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{e.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weight */}
      {tab === 'weight' && (
        <div className="card">
          <div className="card-title">⚖️ Weight / وزن</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input className="input" type="number" placeholder="Weight (kg)" value={weightForm.val} onChange={e => setWeightForm({...weightForm, val: e.target.value})} />
            <input className="input" type="number" placeholder="Height (cm)" value={weightForm.height} onChange={e => setWeightForm({...weightForm, height: e.target.value})} style={{ maxWidth: 140 }} />
            <button className="btn btn-primary" onClick={addWeight}>+ Add</button>
          </div>
          {data.weight.length > 0 && (
            <div className="grid-3 gap-sm mt-md">
              <div className="stat-card"><div className="stat-value">{data.weight[0].val}</div><div className="stat-label">Weight (kg)</div></div>
              <div className="stat-card"><div className="stat-value">{data.weight[0].bmi || '--'}</div><div className="stat-label">BMI</div></div>
              <div className="stat-card"><span className={`badge ${getStatus('weight', data.weight[0]).cls}`}>{getStatus('weight', data.weight[0]).label}</span><div className="stat-label">Status</div></div>
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            {data.weight.slice(0, 10).map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, marginBottom: 4, fontSize: 13 }}>
                <strong>{e.val} kg {e.bmi ? `(BMI: ${e.bmi})` : ''}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{e.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
