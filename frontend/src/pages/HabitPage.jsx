import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { aiAPI } from '../api/axios';

// Extract JSON object from AI response string (which may have trailing disclaimer text)
const parseAIJson = (raw) => {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try {
    // Try direct parse first
    return JSON.parse(raw);
  } catch {
    // Extract first {...} block from the string
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    // Fallback: return as plain text
    return { feedback: raw };
  }
};

export default function HabitPage() {
  const { lang } = useLang();
  const [habits, setHabits] = useState({ water: 0, sleep: 0, activity: 0, mood: '' });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const moods = [
    { emoji: '😊', label: 'Happy',   labelUr: 'خوش' },
    { emoji: '😐', label: 'Okay',    labelUr: 'ٹھیک' },
    { emoji: '😔', label: 'Sad',     labelUr: 'اداس' },
    { emoji: '😰', label: 'Anxious', labelUr: 'فکرمند' },
    { emoji: '😴', label: 'Tired',   labelUr: 'تھکا ہوا' },
  ];

  const getFeedback = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await aiAPI.habitFeedback(habits);
      const parsed = parseAIJson(res.data?.data);
      setFeedback(parsed);
    } catch {
      setFeedback({ feedback: 'Backend se response nahi aaya. Dobara koshish karein.' });
    }
    setLoading(false);
  };

  const pct = (val, max) => `${Math.min(100, Math.round((val / max) * 100))}%`;

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: 'linear-gradient(135deg, #0d6b4a, #2bc48a)' }}>
        <h2>💧 {lang === 'ur' ? 'روزانہ عادات' : 'Daily Habits'}</h2>
        <p>{lang === 'ur' ? 'پانی، نیند اور ورزش ٹریک کریں' : 'Track water, sleep & activity daily'}</p>
      </div>

      {/* ── Counters ── */}
      <div className="grid-3 gap-md mb-md">
        {/* Water */}
        <div className="card text-center">
          <div style={{ fontSize: 36 }}>💧</div>
          <h3 style={{ fontSize: 14, marginTop: 6 }}>{lang === 'ur' ? 'پانی (گلاس)' : 'Water (glasses)'}</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
            <button className="btn btn-outline btn-icon" onClick={() => setHabits(h => ({ ...h, water: Math.max(0, h.water - 1) }))}>−</button>
            <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--blue-500)' }}>{habits.water}</span>
            <button className="btn btn-primary btn-icon" onClick={() => setHabits(h => ({ ...h, water: h.water + 1 }))}>+</button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Goal: 8 {lang === 'ur' ? 'گلاس' : 'glasses'}</div>
          <div style={{ background: 'var(--bg)', borderRadius: 4, height: 8, marginTop: 8 }}>
            <div style={{ width: pct(habits.water, 8), height: '100%', borderRadius: 4, background: 'var(--blue-500)', transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Sleep */}
        <div className="card text-center">
          <div style={{ fontSize: 36 }}>😴</div>
          <h3 style={{ fontSize: 14, marginTop: 6 }}>{lang === 'ur' ? 'نیند (گھنٹے)' : 'Sleep (hours)'}</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
            <button className="btn btn-outline btn-icon" onClick={() => setHabits(h => ({ ...h, sleep: Math.max(0, +(h.sleep - 0.5).toFixed(1)) }))}>−</button>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#9c59d1' }}>{habits.sleep}</span>
            <button className="btn btn-icon" style={{ background: '#9c59d1', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer' }}
              onClick={() => setHabits(h => ({ ...h, sleep: +(h.sleep + 0.5).toFixed(1) }))}>+</button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Goal: 7-8 {lang === 'ur' ? 'گھنٹے' : 'hours'}</div>
          <div style={{ background: 'var(--bg)', borderRadius: 4, height: 8, marginTop: 8 }}>
            <div style={{ width: pct(habits.sleep, 8), height: '100%', borderRadius: 4, background: '#9c59d1', transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Activity */}
        <div className="card text-center">
          <div style={{ fontSize: 36 }}>🏃</div>
          <h3 style={{ fontSize: 14, marginTop: 6 }}>{lang === 'ur' ? 'ورزش (منٹ)' : 'Activity (min)'}</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
            <button className="btn btn-outline btn-icon" onClick={() => setHabits(h => ({ ...h, activity: Math.max(0, h.activity - 10) }))}>−</button>
            <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--green-500)' }}>{habits.activity}</span>
            <button className="btn btn-primary btn-icon" onClick={() => setHabits(h => ({ ...h, activity: h.activity + 10 }))}>+</button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Goal: 30 {lang === 'ur' ? 'منٹ' : 'min'}</div>
          <div style={{ background: 'var(--bg)', borderRadius: 4, height: 8, marginTop: 8 }}>
            <div style={{ width: pct(habits.activity, 30), height: '100%', borderRadius: 4, background: 'var(--green-500)', transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      {/* ── Mood ── */}
      <div className="card mb-md">
        <div className="card-title">🎭 {lang === 'ur' ? 'آج کا موڈ' : "Today's Mood"}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
          {moods.map(m => (
            <div key={m.label} onClick={() => setHabits(h => ({ ...h, mood: m.label }))}
              style={{
                padding: '12px 14px', flex: 1, textAlign: 'center', cursor: 'pointer',
                border: `2px solid ${habits.mood === m.label ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)', background: habits.mood === m.label ? 'var(--green-50)' : 'var(--surface)',
                transition: 'all 0.2s',
              }}>
              <div style={{ fontSize: 24 }}>{m.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4 }}>{lang === 'ur' ? m.labelUr : m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Feedback ── */}
      <div className="card">
        <div className="card-title">🤖 {lang === 'ur' ? 'AI فیڈبیک' : 'AI Daily Feedback'}</div>
        <button className="btn btn-primary w-full mt-sm" onClick={getFeedback} disabled={loading}>
          {loading ? '⏳ Generating feedback...' : '🤖 Get AI Feedback on My Habits'}
        </button>

        {loading && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div className="spinner"></div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>AI analysis ho rahi hai...</p>
          </div>
        )}

        {feedback && !loading && (
          <div className="animate-slide mt-md" style={{ background: 'var(--green-50)', padding: 16, borderRadius: 'var(--radius-sm)' }}>

            {/* Score */}
            {feedback.score != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                  background: feedback.score >= 70 ? 'var(--green-500)' : feedback.score >= 40 ? '#f0a500' : 'var(--red-500)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 900, fontSize: 18,
                }}>
                  {feedback.score}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {feedback.score >= 70 ? '🌟 Excellent!' : feedback.score >= 40 ? '⚡ Good effort' : '💪 Needs work'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Habit Score / روزانہ سکور</div>
                </div>
              </div>
            )}

            {/* English Feedback */}
            {feedback.feedback && (
              <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>📝 {feedback.feedback}</p>
            )}

            {/* Urdu Feedback */}
            {feedback.feedbackUrdu && (
              <p className="urdu" style={{ fontSize: 14, lineHeight: 2, color: 'var(--green-800)', marginBottom: 8 }}>
                {feedback.feedbackUrdu}
              </p>
            )}

            {/* Improvements */}
            {feedback.improvements?.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>🎯 {lang === 'ur' ? 'بہتری کے مشورے' : 'Improvements'}</div>
                {feedback.improvements.map((imp, i) => (
                  <div key={i} style={{ fontSize: 12, padding: '4px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 8 }}>
                    <span>→</span><span>{imp}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Urdu Improvements */}
            {feedback.improvementsUrdu?.length > 0 && (
              <div className="urdu" style={{ marginTop: 8, fontSize: 13 }}>
                {feedback.improvementsUrdu.map((imp, i) => (
                  <div key={i} style={{ padding: '3px 0' }}>• {imp}</div>
                ))}
              </div>
            )}

            {/* Encouragement */}
            {feedback.encouragement && (
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--green-100)', borderRadius: 8, fontSize: 13, fontStyle: 'italic' }}>
                💬 {feedback.encouragement}
                {feedback.encouragementUrdu && (
                  <p className="urdu" style={{ fontSize: 13, marginTop: 4 }}>{feedback.encouragementUrdu}</p>
                )}
              </div>
            )}

            {/* Fallback if only raw text */}
            {!feedback.feedback && !feedback.score && feedback.feedback !== '' && (
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
                {typeof feedback === 'string' ? feedback : JSON.stringify(feedback)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
