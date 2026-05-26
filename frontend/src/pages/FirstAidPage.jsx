import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

const aidData = {
  burn: { title: '🔥 Burns / جلنا', urgent: '⚠️ Large/deep burns — hospital immediately', steps: [
    { en: 'Cool water (not ice) for 10 minutes on burn.', ur: 'جلی جگہ پر 10 منٹ ٹھنڈا پانی ڈالیں' },
    { en: 'Remove rings, watches near burn before swelling.', ur: 'سوجن سے پہلے انگوٹھی ہٹائیں' },
    { en: 'Cover loosely with clean cloth. NO toothpaste/butter.', ur: 'صاف کپڑے سے ڈھانپیں — ٹوتھ پیسٹ نہ لگائیں' },
    { en: 'Panadol for pain. Do NOT burst blisters.', ur: 'پینا ڈول لیں — چھالے نہ پھوڑیں' },
  ]},
  choking: { title: '😮 Choking / گلا پھنسنا', urgent: '⚠️ Cannot breathe/blue = call 1122!', steps: [
    { en: 'If they can cough — encourage coughing.', ur: 'کھانس سکتا ہے تو کھانسنے دیں' },
    { en: '5 firm back blows between shoulder blades.', ur: 'کندھوں کے درمیان 5 مارا لگائیں' },
    { en: '5 abdominal thrusts (Heimlich maneuver).', ur: 'پیٹ پر 5 زور سے دبائو دیں' },
    { en: 'Alternate until object removed or help arrives.', ur: 'دہراتے رہیں جب تک مدد نہ آئے' },
  ]},
  bleeding: { title: '🩸 Bleeding / خون', urgent: '⚠️ Won\'t stop in 10 min = hospital', steps: [
    { en: 'Press firmly with clean cloth. Add more on top.', ur: 'صاف کپڑے سے مضبوطی سے دبائیں' },
    { en: 'Raise injured part above heart.', ur: 'زخمی حصہ دل سے اوپر رکھیں' },
    { en: 'Keep pressing 10-15 minutes.', ur: '10-15 منٹ دباتے رہیں' },
    { en: 'Bandage firmly once bleeding stops.', ur: 'خون رکنے پر باندھ دیں' },
  ]},
  heatstroke: { title: '☀️ Heat Stroke / لو', urgent: '⚠️ High fever + confusion = call 1122!', steps: [
    { en: 'Move to cool shade. Remove extra clothing.', ur: 'ٹھنڈی جگہ لے جائیں' },
    { en: 'Apply cool water on neck, armpits.', ur: 'گردن پر ٹھنڈا پانی لگائیں' },
    { en: 'If conscious: give ORS or salt-lemon water.', ur: 'ہوش ہو تو ORS پلائیں' },
    { en: 'NEVER give Panadol for heatstroke.', ur: 'لو میں پینا ڈول نہ دیں' },
  ]},
  snakebite: { title: '🐍 Snake Bite / سانپ', urgent: '⚠️ ALL snake bites = hospital NOW!', steps: [
    { en: 'Stay calm. Keep bitten limb below heart.', ur: 'پرسکون رہیں' },
    { en: 'Do NOT suck venom, cut wound, or tourniquet.', ur: 'زہر نہ چوسیں — نہ کاٹیں' },
    { en: 'Remove rings/watches near bite.', ur: 'قریبی زیورات ہٹائیں' },
    { en: 'Go to hospital IMMEDIATELY for anti-venom.', ur: 'فوری اسپتال جائیں' },
  ]},
  fracture: { title: '🦴 Fracture / ہڈی ٹوٹنا', urgent: '⚠️ Do NOT straighten a broken bone', steps: [
    { en: 'Keep area still. Do not move the limb.', ur: 'زخمی حصہ نہ ہلائیں' },
    { en: 'Use ruler/newspaper as splint.', ur: 'لکڑی سے سہارا دیں' },
    { en: 'Apply wrapped ice to reduce swelling.', ur: 'کپڑے میں برف لگائیں' },
    { en: 'Hospital for X-ray.', ur: 'ایکسرے کے لیے اسپتال جائیں' },
  ]},
};

export default function FirstAidPage() {
  const { lang } = useLang();
  const [selected, setSelected] = useState(null);

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: 'linear-gradient(135deg, #c72c2c, #e84040)' }}>
        <h2>🩹 {lang === 'ur' ? 'ابتدائی طبی امداد' : 'First Aid Guide'}</h2>
        <p>{lang === 'ur' ? 'ہنگامی صورتحال میں کیا کریں' : 'Emergency steps for common situations'}</p>
      </div>

      {selected && (
        <div className="card mb-md animate-slide" style={{ borderLeft: '4px solid var(--red-500)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>{aidData[selected].title}</h3>
          {aidData[selected].steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--red-500)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <p style={{ fontSize: 14, lineHeight: 1.5 }}>{s.en}</p>
                <p className="urdu" style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{s.ur}</p>
              </div>
            </div>
          ))}
          <div style={{ background: 'var(--red-50)', border: '1px solid var(--red-400)', borderRadius: 'var(--radius-sm)', padding: 12, marginTop: 12, fontSize: 13, fontWeight: 700, color: 'var(--red-600)' }}>
            {aidData[selected].urgent}
          </div>
          <button className="btn btn-outline w-full mt-sm" onClick={() => setSelected(null)}>✕ Close</button>
        </div>
      )}

      <div className="grid-3 gap-md">
        {Object.entries(aidData).map(([key, val]) => (
          <div key={key} className="quick-action" onClick={() => setSelected(key)}
            style={{ border: selected === key ? '2px solid var(--red-500)' : undefined }}>
            <span className="qa-icon">{val.title.split(' ')[0]}</span>
            <span className="qa-label">{val.title.split('/').pop().trim()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
