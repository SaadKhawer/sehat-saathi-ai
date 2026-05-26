import { useEffect, useState } from "react";
import { trendAPI } from "../api/axios";
import { useLang } from "../context/LanguageContext";

export default function TrendsPage() {
  const { lang } = useLang();
  const [region, setRegion] = useState("Punjab");
  const [regional, setRegional] = useState([]);
  const [seasonal, setSeasonal] = useState(null);

  useEffect(() => {
    loadData(region);
  }, [region]);

  const loadData = async (value) => {
    try {
      const regionalRes = await trendAPI.getRegional(value);
      const seasonalRes = await trendAPI.getSeasonal();
      setRegional(regionalRes.data?.data || []);
      setSeasonal(seasonalRes.data?.data || null);
    } catch (error) {
      setRegional([]);
      setSeasonal(null);
    }
  };

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: "linear-gradient(135deg, #0b7285, #1098ad)" }}>
        <h2>📈 {lang === "ur" ? "کمیونٹی ہیلتھ ٹرینڈز" : "Community Health Trends"}</h2>
        <p>{lang === "ur" ? "علاقے کے عام امراض" : "Common diseases by region"}</p>
      </div>

      <div className="card mb-md">
        <label className="label">{lang === "ur" ? "صوبہ منتخب کریں" : "Select Region"}</label>
        <select className="select" value={region} onChange={(event) => setRegion(event.target.value)}>
          <option>Punjab</option>
          <option>Sindh</option>
          <option>KPK</option>
          <option>Balochistan</option>
        </select>
      </div>

      <div className="card mb-md">
        <div className="card-title">🦠 {lang === "ur" ? "عام بیماریاں" : "Top Diseases"}</div>
        {regional.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No trend data found.</p>
        ) : (
          regional.map((item, index) => (
            <div key={`${item.disease}-${index}`} className="notification">
              <span className="notif-icon">📌</span>
              <div>
                <div className="notif-title">
                  {item.disease} {item.diseaseUrdu ? `(${item.diseaseUrdu})` : ""}
                </div>
                <div className="notif-body">
                  Cases: {item.cases} | Trend: {item.trend} | Severity: {item.severity}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <div className="card-title">🌦️ {lang === "ur" ? "موسمی رجحان" : "Seasonal Pattern"}</div>
        {seasonal ? (
          <>
            <p style={{ fontWeight: 700, marginBottom: 6 }}>{seasonal.season}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(seasonal.diseases || []).map((disease, index) => (
                <span className="badge badge-amber" key={`${disease}-${index}`}>
                  {disease}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Seasonal info unavailable.</p>
        )}
      </div>
    </div>
  );
}
