import { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { symptomAPI, aiAPI } from '../api/axios';

export default function SymptomPage() {
  const { lang } = useLang();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'السلام علیکم! میں صحت ساتھی ہوں۔ اپنی تکلیف بتائیں۔\n──────\nHello! I\'m Sehat Saathi. Tell me your symptoms in Urdu or English!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [diseases, setDiseases] = useState(null);
  const chatRef = useRef(null);

  const quickSymptoms = ['بخار اور سردرد', 'پیٹ میں درد', 'کھانسی زکام', 'تھکاوٹ', 'سینے میں جلن', 'جوڑوں میں درد', 'بچے کو بخار'];

  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const newMsgs = [...messages, { role: 'user', content: msg }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const history = newMsgs.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
      const res = await symptomAPI.check({ symptoms: msg, history: history.slice(-20), language: lang === 'ur' ? 'urdu' : 'both' });
      const reply = res.data?.data || 'Sorry, could not analyze. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      // Get disease probability
      try {
        const diseaseRes = await aiAPI.diseaseProbability(msg);
        if (diseaseRes.data?.data?.diseases) setDiseases(diseaseRes.data.data);
      } catch (e) {}
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${err.response?.data?.message || err.message}\n\nPlease check backend is running on port 5000.` }]);
    }
    setLoading(false);
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice not supported. Use Chrome.\nآواز کی سہولت Chrome میں دستیاب ہے');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'ur-PK';
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <div className="animate-fade">
      <div className="hero">
        <h2>🩺 {lang === 'ur' ? 'AI علامات چیکر' : 'AI Symptom Checker'}</h2>
        <p>{lang === 'ur' ? 'اپنی تکلیف بتائیں — میں مدد کروں گا' : 'Tell me your symptoms in Urdu or English'}</p>
      </div>

      <div className="grid-2 gap-md">
        {/* Chat Section */}
        <div className="card" style={{ gridColumn: diseases ? '1' : '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div className="badge badge-green">🟢 AI Active</div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Math.floor(messages.length / 2)} messages</span>
          </div>

          {/* Quick Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {quickSymptoms.map(s => (
              <span key={s} className="pill urdu" onClick={() => sendMessage(s)}>{s}</span>
            ))}
          </div>

          {/* Chat Area */}
          <div className="chat-area" ref={chatRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === 'user' ? 'user' : ''}`}>
                <div className={`msg-avatar ${m.role === 'user' ? 'user' : 'ai'}`}>
                  {m.role === 'user' ? '👤' : '🌿'}
                </div>
                <div className={`bubble ${m.role === 'user' ? 'user' : 'ai'}`}
                  dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br>').replace(/──────/g, '<hr style="border:none;border-top:1px solid #eee;margin:8px 0;">') }} />
              </div>
            ))}
            {loading && (
              <div className="msg">
                <div className="msg-avatar ai">🌿</div>
                <div className="bubble ai"><div className="typing-dots"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div></div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <textarea className="input" value={input} onChange={e => setInput(e.target.value)}
              placeholder={lang === 'ur' ? 'اپنی تکلیف لکھیں...' : 'Type your symptoms...'}
              style={{ minHeight: 48, resize: 'none' }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
            <button className="btn btn-primary btn-icon" onClick={startVoice} title="Voice Input" style={{ background: 'var(--blue-500)' }}>🎤</button>
            <button className="btn btn-primary btn-icon" onClick={() => sendMessage()} disabled={loading}>➤</button>
          </div>

          <button className="btn btn-ghost btn-sm w-full mt-sm" onClick={() => {
            if (confirm('Clear chat history?')) setMessages([messages[0]]);
          }}>🗑️ Clear Chat</button>
        </div>

        {/* Disease Probability Panel */}
        {diseases && diseases.diseases && (
          <div className="card animate-slide">
            <div className="card-title">📊 {lang === 'ur' ? 'بیماری کا امکان' : 'Disease Probability'}</div>
            <div className="card-subtitle">{lang === 'ur' ? 'ممکنہ بیماریاں' : 'Possible conditions'}</div>
            {diseases.diseases.map((d, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                  <span className={`badge ${d.probability > 50 ? 'badge-red' : d.probability > 25 ? 'badge-amber' : 'badge-green'}`}>
                    {d.probability}%
                  </span>
                </div>
                {d.nameUrdu && <div className="urdu" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.nameUrdu}</div>}
                <div style={{ background: 'var(--bg)', borderRadius: 4, height: 6, marginTop: 4 }}>
                  <div style={{ width: `${d.probability}%`, height: '100%', borderRadius: 4,
                    background: d.probability > 50 ? 'var(--red-500)' : d.probability > 25 ? 'var(--amber-500)' : 'var(--green-500)',
                    transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
            {diseases.urgency && (
              <div className={`badge ${diseases.urgency === 'emergency' ? 'badge-red' : diseases.urgency === 'high' ? 'badge-amber' : 'badge-green'}`}
                style={{ marginTop: 8 }}>
                Urgency: {diseases.urgency}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
