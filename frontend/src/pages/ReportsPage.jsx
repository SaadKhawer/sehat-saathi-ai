import { useState } from 'react';
import { useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { reportAPI, aiAPI } from '../api/axios';

export default function ReportsPage() {
  const { lang } = useLang();
  const [symptoms, setSymptoms] = useState('');
  const [labResults, setLabResults] = useState('');
  const [report, setReport] = useState(null);
  const [labReport, setLabReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [savedReports, setSavedReports] = useState([]);

  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = async () => {
    try {
      const res = await reportAPI.listAll();
      setSavedReports(res.data?.data || []);
    } catch (e) {
      setSavedReports([]);
    }
  };

  const generateReport = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const res = await reportAPI.generate({ symptoms });
      setReport(res.data?.data?.content || res.data?.data);
      loadSavedReports();
    } catch (e) {
      setReport({ error: e.response?.data?.message || e.message });
    }
    setLoading(false);
  };

  const interpretLab = async () => {
    if (!labResults.trim()) return;
    setLoading(true);
    try {
      const res = await aiAPI.labInterpret(labResults);
      setLabReport(res.data?.data);
    } catch (e) {
      setLabReport({ error: e.message });
    }
    setLoading(false);
  };

  const downloadPdf = async (reportId = report?.id) => {
    if (!reportId) {
      alert('No report id found. Generate report first.');
      return;
    }
    try {
      const res = await reportAPI.download(reportId);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `sehat-saathi-report.pdf`;
      a.click();
    } catch (e) { alert('PDF download failed: ' + e.message); }
  };

  return (
    <div className="animate-fade">
      <div className="hero" style={{ background: 'linear-gradient(135deg, #1a4a8a, #3a7bd5)' }}>
        <h2>📋 {lang === 'ur' ? 'AI صحت رپورٹ' : 'AI Health Reports'}</h2>
        <p>{lang === 'ur' ? 'AI رپورٹ بنائیں اور PDF ڈاؤنلوڈ کریں' : 'Generate AI reports & download as PDF'}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className={`btn ${activeTab === 'generate' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('generate')}>
          📋 Generate Report
        </button>
        <button className={`btn ${activeTab === 'lab' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('lab')}>
          🔬 Lab Interpreter
        </button>
      </div>

      {activeTab === 'generate' && (
        <div className="card">
          <div className="card-title">📋 {lang === 'ur' ? 'صحت رپورٹ بنائیں' : 'Generate Health Report'}</div>
          <div className="card-subtitle">{lang === 'ur' ? 'اپنی علامات لکھیں' : 'Describe your symptoms for a detailed report'}</div>
          <textarea className="input textarea" value={symptoms} onChange={e => setSymptoms(e.target.value)}
            placeholder={lang === 'ur' ? 'علامات لکھیں...' : 'Describe your symptoms, history, conditions...'} />
          <button className="btn btn-primary w-full mt-sm" onClick={generateReport} disabled={loading}>
            {loading ? '⏳ Generating...' : '🤖 Generate AI Report'}
          </button>
          <button className="btn btn-outline w-full mt-sm" onClick={() => downloadPdf()}>
            ⬇️ Download Latest PDF
          </button>

          {report && !report.error && (
            <div className="mt-md animate-slide" style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📋 Health Report</h3>
              {report.patientSummary && <p style={{ fontSize: 13, marginBottom: 8 }}><strong>Summary:</strong> {report.patientSummary}</p>}
              {report.riskScore !== undefined && (
                <div className="badge badge-amber" style={{ marginBottom: 8 }}>Risk Score: {report.riskScore}/100</div>
              )}
              {report.recommendations && (
                <div style={{ marginTop: 8 }}>
                  <strong>Recommendations:</strong>
                  <ul style={{ marginLeft: 16, marginTop: 4, fontSize: 13 }}>
                    {report.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              {report.dietAdvice && <p style={{ fontSize: 13, marginTop: 8 }}><strong>Diet:</strong> {report.dietAdvice}</p>}
              {typeof report === 'string' && <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br>') }} style={{ fontSize: 13, lineHeight: 1.7 }} />}
            </div>
          )}
        </div>
      )}

      {savedReports.length > 0 && (
        <div className="card mt-md">
          <div className="card-title">🗂️ Saved Reports</div>
          {savedReports.map((item) => (
            <div key={item.id} className="notification">
              <span className="notif-icon">📋</span>
              <div style={{ flex: 1 }}>
                <div className="notif-title">{item.type || 'ai-health-report'}</div>
                <div className="notif-body">{new Date(item.createdAt).toLocaleString()}</div>
              </div>
              <button className="btn btn-sm btn-outline" onClick={() => downloadPdf(item.id)}>
                PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'lab' && (
        <div className="card">
          <div className="card-title">🔬 {lang === 'ur' ? 'لیب ٹیسٹ رپورٹ' : 'Lab Test Interpreter'}</div>
          <div className="card-subtitle">{lang === 'ur' ? 'لیب نتائج لکھیں — AI سادہ اردو میں سمجھائے گا' : 'Paste lab results — AI explains in simple Urdu'}</div>
          <textarea className="input textarea" value={labResults} onChange={e => setLabResults(e.target.value)}
            style={{ minHeight: 120 }}
            placeholder="e.g. Hemoglobin: 11.5 g/dL, WBC: 8500, Platelets: 150000, Sugar Fasting: 110 mg/dL..." />
          <button className="btn btn-primary w-full mt-sm" onClick={interpretLab} disabled={loading}>
            {loading ? '⏳ Interpreting...' : '🔬 Interpret Lab Results'}
          </button>

          {labReport && !labReport.error && (
            <div className="mt-md animate-slide" style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Lab Results Explained</h3>
              {typeof labReport === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: labReport.replace(/\n/g, '<br>') }} style={{ fontSize: 13, lineHeight: 1.7 }} />
              ) : labReport.results ? (
                labReport.results.map((r, i) => (
                  <div key={i} style={{ padding: 10, background: 'var(--surface)', borderRadius: 8, marginBottom: 8, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{r.test}</strong>
                      <span className={`badge ${r.status === 'normal' ? 'badge-green' : r.status === 'high' ? 'badge-red' : 'badge-amber'}`}>
                        {r.status === 'normal' ? '✅' : r.status === 'high' ? '🚨' : '⚠️'} {r.value}
                      </span>
                    </div>
                    {r.explanationUrdu && <p className="urdu" style={{ fontSize: 13, marginTop: 4, color: 'var(--text-secondary)' }}>{r.explanationUrdu}</p>}
                  </div>
                ))
              ) : <p>{JSON.stringify(labReport)}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
