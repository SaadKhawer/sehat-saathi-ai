import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { alertAPI, habitAPI, profileAPI, aiAPI } from '../api/axios';

// Safe string converter — never lets an object reach JSX
const safeStr = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.tip || val.message || val.text || JSON.stringify(val);
  return String(val);
};

export default function DashboardPage() {
  const { userData } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();

  const [riskScore, setRiskScore]     = useState(25);
  const [tipText, setTipText]         = useState('');
  const [tipUrdu, setTipUrdu]         = useState('');
  const [tipCategory, setTipCategory] = useState('');
  const [alerts, setAlerts]           = useState([]);
  const [todayHabits, setTodayHabits] = useState(null);

  const greetingName = userData?.name || 'User';
  const hour         = new Date().getHours();
  const greeting     = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const greetingUr   = hour < 12 ? 'صبح بخیر' : hour < 17 ? 'اسلام علیکم' : 'شام بخیر';

  useEffect(() => {
    loadDailyTip();
    loadData();
  }, []); // eslint-disable-line

  /* ── Load AI Daily Tip ── */
  const loadDailyTip = async () => {
    try {
      const month  = new Date().getMonth();
      const season = month >= 5 && month <= 8 ? 'summer/monsoon'
                   : month >= 9 && month <= 11 ? 'autumn/winter'
                   : 'spring';
      const res = await aiAPI.dailyTip({ season, region: userData?.city || 'Punjab' });
      const raw = res.data?.data;
      if (!raw) return;

      // Step 1: try direct JSON parse
      let parsed = null;
      if (typeof raw === 'string') {
        try {
          parsed = JSON.parse(raw);
        } catch {
          // Step 2: extract {...} block from string (handles trailing disclaimer)
          const match = raw.match(/\{[\s\S]*?\}/);
          if (match) {
            try { parsed = JSON.parse(match[0]); } catch {}
          }
        }
      } else if (typeof raw === 'object') {
        parsed = raw;
      }

      if (parsed) {
        // Always set primitive strings — never put object into JSX
        setTipText(typeof parsed.tip === 'string' ? parsed.tip : '');
        setTipUrdu(typeof parsed.tipUrdu === 'string' ? parsed.tipUrdu : '');
        setTipCategory(typeof parsed.category === 'string' ? parsed.category : '');
      }
    } catch { /* silent */ }
  };

  /* ── Load profiles, habits, alerts ── */
  const loadData = async () => {
    try {
      const profileRes   = await profileAPI.getAll();
      const firstProfile = profileRes.data?.data?.[0];
      if (firstProfile?.id) {
        try {
          const habitRes = await habitAPI.getToday(firstProfile.id);
          setTodayHabits(habitRes.data?.data || null);
        } catch { /* silent */ }
      }
    } catch { /* silent */ }

    try {
      const alertRes = await alertAPI.getAll();
      setAlerts(alertRes.data?.data?.slice(0, 3) || []);
    } catch { /* silent */ }

    setRiskScore(25);
  };

  const quickActions = [
    { icon: '🩺', label: 'Check Symptoms', labelUr: 'علامات چیک کریں', path: '/symptoms' },
    { icon: '🚨', label: 'Emergency',       labelUr: 'ایمرجنسی',         path: '/emergency' },
    { icon: '📋', label: 'Reports',         labelUr: 'رپورٹس',           path: '/reports'   },
    { icon: '💊', label: 'Medicine',        labelUr: 'دوائی',            path: '/medicine'  },
    { icon: '💧', label: 'Habits',          labelUr: 'عادات',            path: '/habits'    },
    { icon: '🍽️', label: 'Diet Plan',       labelUr: 'غذائی منصوبہ',    path: '/diet'      },
  ];

  return (
    <div className="animate-fade">
      {/* ── Hero ── */}
      <div className="hero" style={{ marginBottom: 24 }}>
        <h2>{greeting}, {greetingName}! 👋</h2>
        <p className="urdu" style={{ fontSize: 18, marginTop: 4, opacity: 0.95 }}>
          {greetingUr}، {greetingName}
        </p>
        <p style={{ marginTop: 8, opacity: 0.85, fontSize: 13 }}>
          Your AI-powered health companion is ready to help<br />
          <span className="urdu" style={{ fontSize: 14 }}>آپ کا AI صحت ساتھی تیار ہے</span>
        </p>
      </div>

      {/* ── Quick Actions ── */}
      <div className="quick-actions mb-lg">
        {quickActions.map(qa => (
          <div key={qa.path} className="quick-action" onClick={() => navigate(qa.path)}>
            <span className="qa-icon">{qa.icon}</span>
            <span className="qa-label">{lang === 'ur' ? qa.labelUr : qa.label}</span>
          </div>
        ))}
      </div>

      <div className="grid-2 gap-md">
        {/* ── Health Risk Score ── */}
        <div className="card">
          <div className="card-title">📊 {lang === 'ur' ? 'صحت رسک سکور' : 'Health Risk Score'}</div>
          <div className="card-subtitle">{lang === 'ur' ? 'آپ کی مجموعی صحت' : 'Your overall health status'}</div>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="score-circle score-low"
              style={{ '--score-pct': `${riskScore * 3.6}deg`, margin: '0 auto' }}>
              <div className="score-inner">
                <div className="score-value">{riskScore}</div>
                <div className="score-label">{lang === 'ur' ? 'کم خطرہ' : 'Low Risk'}</div>
              </div>
            </div>
            {todayHabits && (
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span className="badge badge-blue">💧 {todayHabits.water || 0} glasses</span>
                <span className="badge badge-purple">😴 {todayHabits.sleep || 0} hrs</span>
                <span className="badge badge-green">🏃 {todayHabits.activity || 0} min</span>
              </div>
            )}
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
              {lang === 'ur' ? 'صحت ٹریکر سے ڈیٹا شامل کریں' : 'Track habits to update score'}
            </p>
          </div>
        </div>

        {/* ── Daily Tip ── */}
        <div className="card">
          <div className="card-title">💡 {lang === 'ur' ? 'آج کی صحت ٹپ' : 'Daily Health Tip'}</div>
          <div className="card-subtitle">{lang === 'ur' ? 'AI سے روزانہ مشورہ' : 'AI-generated daily advice'}</div>
          <div style={{ padding: 16, background: 'var(--green-50)', borderRadius: 'var(--radius-sm)', marginTop: 12 }}>
            {tipText ? (
              <>
                <p style={{ fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>{tipText}</p>
                {tipUrdu  && <p className="urdu" style={{ fontSize: 14, marginTop: 8, color: 'var(--green-800)' }}>{tipUrdu}</p>}
                {tipCategory && <span style={{ fontSize: 11, color: 'var(--green-600)', marginTop: 6, display: 'block' }}>📌 {tipCategory}</span>}
              </>
            ) : (
              <>
                <p style={{ fontSize: 14 }}>🌞 Stay hydrated! Drink at least 8 glasses of water today.</p>
                <p className="urdu" style={{ fontSize: 14, marginTop: 6, color: 'var(--green-800)' }}>
                  آج کم از کم 8 گلاس پانی پئیں
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Activity & Notifications ── */}
      <div className="grid-2 gap-md mt-md">
        <div className="card">
          <div className="card-title">⏳ {lang === 'ur' ? 'حالیہ سرگرمی' : 'Recent Activity'}</div>
          <div style={{ marginTop: 12 }}>
            {[
              { icon: '🩺', title: 'Symptom Check', body: 'Start checking your symptoms with AI' },
              { icon: '💧', title: 'Track Your Habits', body: 'Log your water, sleep & activity' },
              { icon: '👨‍👩‍👧‍👦', title: 'Add Family Members', body: 'Track health for your whole family' },
            ].map(n => (
              <div className="notification" key={n.title}>
                <span className="notif-icon">{n.icon}</span>
                <div>
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-body">{n.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">🔔 {lang === 'ur' ? 'اطلاعات' : 'Notifications'}</div>
          <div style={{ marginTop: 12 }}>
            {alerts.length > 0 ? alerts.map((a, i) => (
              <div className="notification" key={i} style={{ borderLeft: '3px solid var(--amber-500)' }}>
                <span className="notif-icon">🔔</span>
                <div>
                  <div className="notif-title">{lang === 'ur' ? (a.titleUrdu || a.title || '') : (a.title || '')}</div>
                  <div className="notif-body">{lang === 'ur' ? (a.messageUrdu || a.message || '') : (a.message || '')}</div>
                </div>
              </div>
            )) : (
              <>
                <div className="notification" style={{ borderLeft: '3px solid var(--amber-500)' }}>
                  <span className="notif-icon">⚠️</span>
                  <div>
                    <div className="notif-title">Dengue Alert — Punjab</div>
                    <div className="notif-body urdu">مچھر دانی استعمال کریں</div>
                  </div>
                </div>
                <div className="notification" style={{ borderLeft: '3px solid var(--green-500)' }}>
                  <span className="notif-icon">🌡️</span>
                  <div>
                    <div className="notif-title">Weather Advisory</div>
                    <div className="notif-body urdu">گرمی میں پانی زیادہ پئیں</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div style={{ textAlign: 'center', padding: '20px 16px', fontSize: 11, color: 'var(--text-muted)', marginTop: 24 }}>
        ⚕️ Sehat Saathi provides AI-based health information — not a substitute for professional medical advice.<br />
        <span className="urdu">یہ پیشہ ورانہ طبی مشورے کا متبادل نہیں ہے</span>
      </div>
    </div>
  );
}
