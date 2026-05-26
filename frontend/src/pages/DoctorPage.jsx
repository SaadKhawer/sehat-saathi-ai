import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

const doctors = [
  { id: 1, name: 'Dr. Ayesha Khan', nameUr: 'ڈاکٹر عائشہ خان', specialty: 'General Physician', specialtyUr: 'جنرل فزیشن', city: 'Lahore', fee: 'PKR 1,500', rating: 4.9, available: true, avatar: '👩‍⚕️', hospital: 'Services Hospital', times: ['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'] },
  { id: 2, name: 'Dr. Muhammad Usman', nameUr: 'ڈاکٹر محمد عثمان', specialty: 'Cardiologist', specialtyUr: 'دل کے ماہر', city: 'Karachi', fee: 'PKR 3,000', rating: 4.8, available: true, avatar: '👨‍⚕️', hospital: 'Aga Khan Hospital', times: ['9:00 AM', '11:00 AM', '2:00 PM'] },
  { id: 3, name: 'Dr. Sana Malik', nameUr: 'ڈاکٹر ثنا ملک', specialty: 'Pediatrician', specialtyUr: 'بچوں کے ماہر', city: 'Islamabad', fee: 'PKR 2,000', rating: 4.9, available: true, avatar: '👩‍⚕️', hospital: 'PIMS Hospital', times: ['10:00 AM', '1:00 PM', '4:00 PM', '6:00 PM'] },
  { id: 4, name: 'Dr. Farhan Ahmed', nameUr: 'ڈاکٹر فرحان احمد', specialty: 'Dermatologist', specialtyUr: 'جلد کے ماہر', city: 'Lahore', fee: 'PKR 2,500', rating: 4.7, available: false, avatar: '👨‍⚕️', hospital: 'Shaukat Khanum', times: ['11:00 AM', '3:00 PM'] },
  { id: 5, name: 'Dr. Nadia Hussain', nameUr: 'ڈاکٹر نادیہ حسین', specialty: 'Gynecologist', specialtyUr: 'خواتین کی ماہر', city: 'Karachi', fee: 'PKR 2,800', rating: 4.8, available: true, avatar: '👩‍⚕️', hospital: 'South City Hospital', times: ['9:00 AM', '12:00 PM', '3:00 PM'] },
  { id: 6, name: 'Dr. Tariq Mahmood', nameUr: 'ڈاکٹر طارق محمود', specialty: 'Orthopedic', specialtyUr: 'ہڈیوں کے ماہر', city: 'Rawalpindi', fee: 'PKR 2,200', rating: 4.6, available: true, avatar: '👨‍⚕️', hospital: 'Holy Family Hospital', times: ['10:00 AM', '2:00 PM', '5:00 PM'] },
];

const specialties = ['All', 'General Physician', 'Cardiologist', 'Pediatrician', 'Dermatologist', 'Gynecologist', 'Orthopedic'];
const cities = ['All', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'];

export default function DoctorPage() {
  const { lang } = useLang();
  const [filter, setFilter] = useState({ specialty: 'All', city: 'All' });
  const [selected, setSelected] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [booked, setBooked] = useState(false);
  const [bookingDate, setBookingDate] = useState('');

  const filtered = doctors.filter(d =>
    (filter.specialty === 'All' || d.specialty === filter.specialty) &&
    (filter.city === 'All' || d.city === filter.city)
  );

  const handleBook = () => {
    if (!selectedTime || !patientName || !bookingDate) return;
    setBooked(true);
  };

  const resetBooking = () => {
    setBooked(false); setSelected(null);
    setSelectedTime(''); setPatientName('');
    setPatientPhone(''); setBookingDate('');
  };

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: 'linear-gradient(135deg, #0d6b4a, #1a9e6e)' }}>
        <h2>🏥 {lang === 'ur' ? 'ڈاکٹر اپوائنٹمنٹ' : 'Doctor Appointment'}</h2>
        <p>{lang === 'ur' ? 'پاکستان کے بہترین ڈاکٹروں سے ملیں' : 'Book appointments with top doctors in Pakistan'}</p>
      </div>

      {/* Filters */}
      <div className="card mb-md">
        <div className="grid-2 gap-md">
          <div>
            <label className="label">🩺 {lang === 'ur' ? 'خصوصیت' : 'Specialty'}</label>
            <select className="select" value={filter.specialty} onChange={e => setFilter(f => ({ ...f, specialty: e.target.value }))}>
              {specialties.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">📍 {lang === 'ur' ? 'شہر' : 'City'}</label>
            <select className="select" value={filter.city} onChange={e => setFilter(f => ({ ...f, city: e.target.value }))}>
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid-2 gap-md mb-md">
        {filtered.map(doc => (
          <div key={doc.id} className="card" style={{ borderLeft: `4px solid ${doc.available ? 'var(--green-500)' : 'var(--text-muted)'}`, cursor: 'pointer' }}
            onClick={() => { setSelected(doc); setBooked(false); setSelectedTime(''); }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 42, lineHeight: 1 }}>{doc.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>{doc.name}</h3>
                  <span className={`badge ${doc.available ? 'badge-green' : 'badge-red'}`}>
                    {doc.available ? '✓ Available' : '✗ Busy'}
                  </span>
                </div>
                {lang === 'ur' && <div className="urdu" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{doc.nameUr}</div>}
                <div style={{ fontSize: 13, color: 'var(--primary-dark)', fontWeight: 600, marginTop: 2 }}>
                  {lang === 'ur' ? doc.specialtyUr : doc.specialty}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  🏥 {doc.hospital} · 📍 {doc.city}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-dark)' }}>{doc.fee}</span>
                  <span style={{ fontSize: 12 }}>⭐ {doc.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card animate-scale" style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            {booked ? (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--green-700)', marginBottom: 8 }}>
                  Appointment Booked!
                </h3>
                <p className="urdu" style={{ fontSize: 16, marginBottom: 16 }}>اپوائنٹمنٹ بک ہو گئی</p>
                <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'left', marginBottom: 20 }}>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>👨‍⚕️ <strong>{selected.name}</strong></div>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>📅 {bookingDate} at {selectedTime}</div>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>🏥 {selected.hospital}, {selected.city}</div>
                  <div style={{ fontSize: 13 }}>👤 {patientName} · 📞 {patientPhone}</div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                  A confirmation SMS will be sent to {patientPhone}
                </p>
                <button className="btn btn-primary w-full" onClick={resetBooking}>✓ Done</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>📅 Book Appointment</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 36 }}>{selected.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{selected.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--primary-dark)' }}>{selected.specialty}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selected.hospital} · {selected.fee}</div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">👤 Your Name / آپ کا نام</label>
                  <input className="input" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Enter your full name" />
                </div>
                <div className="form-group">
                  <label className="label">📞 Phone / فون</label>
                  <input className="input" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} placeholder="03XX-XXXXXXX" />
                </div>
                <div className="form-group">
                  <label className="label">📅 Date / تاریخ</label>
                  <input className="input" type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label className="label">⏰ Time Slot / وقت</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selected.times.map(t => (
                      <div key={t} onClick={() => setSelectedTime(t)}
                        style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                          border: `2px solid ${selectedTime === t ? 'var(--primary)' : 'var(--border)'}`,
                          background: selectedTime === t ? 'var(--green-50)' : 'var(--surface)',
                          color: selectedTime === t ? 'var(--primary-dark)' : 'var(--text)' }}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary w-full"
                  disabled={!selectedTime || !patientName || !bookingDate || !selected.available}
                  onClick={handleBook}>
                  {selected.available ? '✓ Confirm Appointment' : '✗ Doctor Not Available Today'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
