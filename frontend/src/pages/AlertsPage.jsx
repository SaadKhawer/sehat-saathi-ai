import { useState } from 'react';
import { useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { alertAPI } from '../api/axios';

export default function AlertsPage() {
  const { lang } = useLang();
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [vaccineName, setVaccineName] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const [userAlerts, regionalAlerts] = await Promise.all([alertAPI.getAll(), alertAPI.getRegional()]);
      const combined = [...(userAlerts.data?.data || []), ...(regionalAlerts.data?.data || [])];
      setAlerts(combined.slice(0, 8));
    } catch (error) {
      setAlerts([]);
    }
  };

  const saveReminder = async () => {
    if (!vaccineName || !dueDate) return;
    await alertAPI.setVaccineReminder({
      vaccineName,
      vaccineNameUrdu: vaccineName,
      dueDate,
    });
    setVaccineName('');
    setDueDate('');
    setShowVaccineForm(false);
    loadAlerts();
  };
  const defaultAlerts = [
    { type: 'dengue', icon: '🦟', title: 'Dengue Alert — Punjab', titleUr: 'ڈینگی الرٹ — پنجاب', msg: 'Cases rising. Use mosquito nets.', msgUr: 'کیسز بڑھ رہے ہیں۔ مچھر دانی استعمال کریں۔', severity: 'warning' },
    { type: 'weather', icon: '☀️', title: 'Heat Wave — Sindh', titleUr: 'شدید گرمی — سندھ', msg: 'Stay hydrated. Avoid 12-4pm outdoors.', msgUr: 'پانی زیادہ پئیں۔ دوپہر باہر نہ نکلیں۔', severity: 'warning' },
    { type: 'smog', icon: '🌫️', title: 'Smog Season — Lahore', titleUr: 'اسموگ — لاہور', msg: 'Wear masks. Keep children indoors.', msgUr: 'ماسک پہنیں۔ بچوں کو اندر رکھیں۔', severity: 'info' },
    { type: 'vaccine', icon: '💉', title: 'COVID Booster Available', titleUr: 'کوویڈ بوسٹر دستیاب', msg: 'Free at govt hospitals.', msgUr: 'سرکاری اسپتالوں میں مفت۔', severity: 'info' },
  ];

  const vaccines = [
    { name: 'BCG', age: 'Birth', nameUr: 'بی سی جی' },
    { name: 'OPV', age: '0, 6, 10, 14 weeks', nameUr: 'پولیو' },
    { name: 'Pentavalent', age: '6, 10, 14 weeks', nameUr: 'پینٹاویلینٹ' },
    { name: 'Measles 1', age: '9 months', nameUr: 'خسرہ 1' },
    { name: 'Measles 2', age: '15 months', nameUr: 'خسرہ 2' },
    { name: 'Typhoid', age: 'After 2 years', nameUr: 'ٹائیفائیڈ' },
  ];

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: 'linear-gradient(135deg, #c72c2c, #f06565)' }}>
        <h2>🔔 {lang === 'ur' ? 'صحت الرٹس' : 'Health Alerts'}</h2>
        <p>{lang === 'ur' ? 'ویکسین اور بیماری الرٹس' : 'Vaccination reminders & disease alerts'}</p>
      </div>

      {/* Active Alerts */}
      <div className="card mb-md">
        <div className="card-title">⚠️ {lang === 'ur' ? 'فعال الرٹس' : 'Active Alerts'}</div>
        <div style={{ marginTop: 12 }}>
          {(alerts.length ? alerts : defaultAlerts).map((a, i) => (
            <div key={i} className="notification" style={{ borderLeft: `3px solid ${a.severity === 'warning' ? 'var(--amber-500)' : 'var(--blue-500)'}` }}>
              <span className="notif-icon">{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div className="notif-title">{lang === 'ur' ? (a.titleUr || a.titleUrdu || a.title) : a.title}</div>
                <div className="notif-body">{lang === 'ur' ? (a.msgUr || a.messageUrdu || a.message) : (a.msg || a.message)}</div>
              </div>
              <span className={`badge ${a.severity === 'warning' ? 'badge-amber' : 'badge-blue'}`}>{a.severity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vaccination Schedule */}
      <div className="card mb-md">
        <div className="card-title">💉 {lang === 'ur' ? 'ویکسین شیڈول (پاکستان)' : 'Pakistan EPI Vaccine Schedule'}</div>
        <div style={{ marginTop: 12 }}>
          {vaccines.map((v, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', background: i % 2 === 0 ? 'var(--bg)' : 'var(--surface)',
              borderRadius: 'var(--radius-sm)', marginBottom: 4 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>💉 {v.name}</div>
                <div className="urdu" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.nameUr}</div>
              </div>
              <div className="badge badge-blue">{v.age}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Set Reminder */}
      <div className="card">
        <div className="card-title">⏰ {lang === 'ur' ? 'ویکسین یاد دہانی' : 'Set Vaccine Reminder'}</div>
        <button className="btn btn-primary mt-sm" onClick={() => setShowVaccineForm(!showVaccineForm)}>
          ➕ {lang === 'ur' ? 'یاد دہانی لگائیں' : 'Add Reminder'}
        </button>
        {showVaccineForm && (
          <div className="mt-sm animate-slide">
            <div className="grid-2 gap-sm">
              <div><label className="label">Vaccine Name</label><input className="input" placeholder="e.g. Measles" value={vaccineName} onChange={(e) => setVaccineName(e.target.value)} /></div>
              <div><label className="label">Due Date</label><input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
            </div>
            <button className="btn btn-primary mt-sm" onClick={saveReminder}>✓ Set Reminder</button>
          </div>
        )}
      </div>
    </div>
  );
}
