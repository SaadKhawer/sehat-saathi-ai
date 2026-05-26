import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { profileAPI } from '../api/axios';

export default function ProfilePage() {
  const { lang } = useLang();
  const [profiles, setProfiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', relation: 'child', age: '', gender: '', bloodGroup: '', allergies: '', conditions: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadProfiles(); }, []);

  const loadProfiles = async () => {
    try { const res = await profileAPI.getAll(); setProfiles(res.data?.data || []); } catch (e) {}
  };

  const addProfile = async () => {
    setLoading(true);
    try {
      await profileAPI.create({
        ...form,
        age: parseInt(form.age) || null,
        allergies: form.allergies.split(',').map(a => a.trim()).filter(Boolean),
        conditions: form.conditions.split(',').map(c => c.trim()).filter(Boolean),
      });
      setForm({ name: '', relation: 'child', age: '', gender: '', bloodGroup: '', allergies: '', conditions: '' });
      setShowForm(false);
      loadProfiles();
    } catch (e) { alert(e.response?.data?.message || e.message); }
    setLoading(false);
  };

  const deleteProfile = async (id) => {
    if (!confirm('Delete this profile?')) return;
    try { await profileAPI.delete(id); loadProfiles(); } catch (e) { alert(e.message); }
  };

  const relations = { self: '👤 Self', father: '👨 Father', mother: '👩 Mother', spouse: '💑 Spouse', child: '👶 Child', sibling: '👫 Sibling', other: '👥 Other' };

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: 'linear-gradient(135deg, #4a3580, #7c5cbf)' }}>
        <h2>👨‍👩‍👧‍👦 {lang === 'ur' ? 'خاندانی پروفائلز' : 'Family Health Profiles'}</h2>
        <p>{lang === 'ur' ? 'خاندان کے ہر فرد کی صحت ٹریک کریں' : 'Track health for each family member separately'}</p>
      </div>

      <button className="btn btn-primary mb-md" onClick={() => setShowForm(!showForm)}>
        ➕ {lang === 'ur' ? 'نیا فرد شامل کریں' : 'Add Family Member'}
      </button>

      {showForm && (
        <div className="card mb-md animate-slide">
          <div className="card-title">➕ Add Member</div>
          <div className="grid-2 gap-sm mt-sm">
            <div><label className="label">Name / نام</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div><label className="label">Relation / رشتہ</label>
              <select className="select" value={form.relation} onChange={e => setForm({...form, relation: e.target.value})}>
                {Object.entries(relations).filter(([k]) => k !== 'self').map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label className="label">Age / عمر</label><input className="input" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} /></div>
            <div><label className="label">Gender</label>
              <select className="select" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
              </select>
            </div>
            <div><label className="label">Blood Group</label><input className="input" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} placeholder="e.g. O+" /></div>
            <div><label className="label">Allergies (comma separated)</label><input className="input" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} /></div>
          </div>
          <div className="mt-sm"><label className="label">Medical Conditions</label><input className="input" value={form.conditions} onChange={e => setForm({...form, conditions: e.target.value})} placeholder="Diabetes, BP..." /></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-primary" onClick={addProfile} disabled={loading}>{loading ? '⏳' : '✓ Save'}</button>
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid-2 gap-md">
        {profiles.map(p => (
          <div key={p.id} className="card" style={{ borderLeft: `4px solid ${p.relation === 'self' ? 'var(--green-500)' : 'var(--purple-500)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{relations[p.relation]?.split(' ')[0] || '👤'}</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{relations[p.relation]} {p.age ? `• ${p.age} yrs` : ''} {p.gender ? `• ${p.gender}` : ''}</div>
              </div>
              {p.relation !== 'self' && (
                <button className="btn btn-ghost btn-sm" onClick={() => deleteProfile(p.id)} style={{ color: 'var(--red-500)' }}>🗑️</button>
              )}
            </div>
            {p.bloodGroup && <div className="badge badge-red mt-sm">🩸 {p.bloodGroup}</div>}
            {p.allergies?.length > 0 && <div style={{ fontSize: 12, marginTop: 6 }}>⚠️ Allergies: {p.allergies.join(', ')}</div>}
            {p.conditions?.length > 0 && <div style={{ fontSize: 12, marginTop: 4 }}>💊 Conditions: {p.conditions.join(', ')}</div>}
          </div>
        ))}
      </div>

      {profiles.length === 0 && (
        <div className="card text-center" style={{ padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍👩‍👧‍👦</div>
          <p style={{ fontWeight: 600 }}>No profiles yet</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Add family members to track their health separately</p>
        </div>
      )}
    </div>
  );
}
