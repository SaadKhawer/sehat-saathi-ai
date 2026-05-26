import { useState, useEffect } from 'react';
import { emergencyAPI } from '../api/axios';

export default function EmergencyPage() {
  const [contacts, setContacts] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [recommendedHospital, setRecommendedHospital] = useState(null);
  const [city, setCity] = useState('');
  const [location, setLocation] = useState(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    loadContacts();
    getLocation();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await emergencyAPI.getContacts();
      setContacts(res.data?.data || []);
    } catch (e) {
      setContacts([
        { name: 'Rescue', nameUrdu: 'ریسکیو', number: '1122' },
        { name: 'Edhi', nameUrdu: 'ایدھی', number: '115' },
        { name: 'Police', nameUrdu: 'پولیس', number: '15' },
        { name: 'Fire', nameUrdu: 'فائر', number: '16' },
      ]);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          await loadNearestByLocation(coords);
        },
        () => console.log('Location access denied')
      );
    }
  };

  const loadNearestByLocation = async (coords = location) => {
    if (!coords) return;
    try {
      const res = await emergencyAPI.getHospitals({ lat: coords.lat, lng: coords.lng });
      const nearest = res.data?.data?.[0] || null;
      setRecommendedHospital(nearest);
    } catch (e) {
      setRecommendedHospital(null);
    }
  };

  const loadHospitals = async (selectedCity) => {
    setCity(selectedCity);
    try {
      const res = await emergencyAPI.getHospitals({ city: selectedCity });
      setHospitals(res.data?.data || []);
    } catch (e) { setHospitals([]); }
  };

  const shareLocation = async () => {
    if (!location) { alert('Location not available'); return; }
    setSharing(true);
    try {
      const res = await emergencyAPI.shareLocation(location);
      const data = res.data?.data;
      if (data?.whatsappUrl) window.open(data.whatsappUrl, '_blank');
    } catch (e) {
      const url = `https://wa.me/?text=${encodeURIComponent(`🚨 Emergency! My location: https://maps.google.com/?q=${location.lat},${location.lng}`)}`;
      window.open(url, '_blank');
    }
    setSharing(false);
  };

  return (
    <div className="animate-fade">
      {/* Emergency Header */}
      <div style={{ background: 'linear-gradient(135deg, #c72c2c, #e84040)', borderRadius: 'var(--radius-lg)',
        padding: 28, color: 'white', textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🚨</div>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Emergency Mode</h2>
        <p className="urdu" style={{ fontSize: 18, marginTop: 4 }}>ہنگامی صورتحال</p>
        {location && (
          <p style={{ fontSize: 12, marginTop: 8, opacity: 0.8 }}>📍 Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
        )}
        <button className="btn btn-lg" onClick={shareLocation} disabled={sharing}
          style={{ background: 'white', color: 'var(--red-500)', marginTop: 16, fontWeight: 700 }}>
          📤 {sharing ? 'Sharing...' : 'Share Location via WhatsApp'}
        </button>
      </div>

      {/* Emergency Numbers */}
      <div className="card mb-md">
        <div className="card-title">📞 Emergency Numbers / ہنگامی نمبر</div>
        <div style={{ marginTop: 12 }}>
          {contacts.map((c, i) => (
            <a key={i} href={`tel:${c.number}`} style={{ textDecoration: 'none' }}>
              <div className="emergency-number" style={{ background: 'var(--red-50)', border: '1px solid #f0a0a0',
                borderRadius: 'var(--radius-sm)', padding: '14px 20px', marginBottom: 8, display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.name}</div>
                  <div className="urdu" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.nameUrdu}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--red-500)' }}>{c.number}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Auto nearest recommendation by GPS */}
      <div className="card mb-md">
        <div className="card-title">🎯 Recommended Nearest Hospital</div>
        {!location && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Allow location access to get nearest hospital recommendation.
          </p>
        )}
        {location && !recommendedHospital && (
          <button className="btn btn-primary mt-sm" onClick={() => loadNearestByLocation()}>
            Find Nearest by My Location
          </button>
        )}
        {recommendedHospital && (
          <div style={{ marginTop: 10, padding: 14, borderRadius: 'var(--radius-sm)', background: 'var(--green-50)', border: '1px solid var(--green-200)' }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>🏥 {recommendedHospital.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{recommendedHospital.type} • {recommendedHospital.dist}</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-green">Nearest</span>
              {typeof recommendedHospital.distance === 'number' && (
                <span className="badge badge-blue">{recommendedHospital.distance.toFixed(1)} km</span>
              )}
            </div>
            {recommendedHospital.phone && (
              <a href={`tel:${recommendedHospital.phone}`} className="btn btn-emergency mt-sm" style={{ display: 'inline-block', textDecoration: 'none' }}>
                📞 Call Now
              </a>
            )}
          </div>
        )}
      </div>

      {/* Nearby Hospitals */}
      <div className="card">
        <div className="card-title">🏥 Nearby Hospitals / قریبی اسپتال</div>
        <select className="select mt-sm" value={city} onChange={e => loadHospitals(e.target.value)}>
          <option value="">-- Select City / شہر چنیں --</option>
          <option value="lahore">Lahore / لاہور</option>
          <option value="karachi">Karachi / کراچی</option>
          <option value="islamabad">Islamabad / اسلام آباد</option>
          <option value="rawalpindi">Rawalpindi / راولپنڈی</option>
          <option value="peshawar">Peshawar / پشاور</option>
          <option value="quetta">Quetta / کوئٹہ</option>
          <option value="faisalabad">Faisalabad / فیصل آباد</option>
          <option value="multan">Multan / ملتان</option>
        </select>

        <div style={{ marginTop: 14 }}>
          {hospitals.length > 0 ? hospitals.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: 14, background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--green-50)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏥</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{h.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.type}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  {h.tags?.includes('free') && <span className="badge badge-green">✓ Free</span>}
                  {h.tags?.includes('emergency') && <span className="badge badge-red">⚡ Emergency</span>}
                  {h.tags?.includes('24/7') && <span className="badge badge-blue">24/7</span>}
                  <span className="badge badge-amber">📍 {h.dist}</span>
                </div>
                {h.phone && <a href={`tel:${h.phone}`} style={{ fontSize: 12, color: 'var(--blue-500)', marginTop: 4, display: 'block' }}>📞 {h.phone}</a>}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🏥</div>
              <p>Select a city to see hospitals</p>
              <p className="urdu">اپنا شہر منتخب کریں</p>
            </div>
          )}
        </div>
      </div>

      {/* Warning */}
      <div style={{ background: 'var(--amber-50)', border: '1px solid #f0c040', borderRadius: 'var(--radius-sm)',
        padding: '12px 16px', fontSize: 12, color: '#7a5000', marginTop: 16, textAlign: 'center' }}>
        ⚠️ In life-threatening emergencies, call 1122 or 115 immediately.<br />
        <span className="urdu">جان کا خطرہ ہو تو فوری 1122 یا 115 کال کریں</span>
      </div>
    </div>
  );
}
