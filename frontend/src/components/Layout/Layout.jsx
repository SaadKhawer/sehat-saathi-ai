import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';

const navItems = [
  { path: '/', icon: '📊', label: 'Dashboard', labelUr: 'ڈیش بورڈ' },
  { path: '/symptoms', icon: '🩺', label: 'Symptoms', labelUr: 'علامات' },
  { path: '/prediction', icon: '🧬', label: 'AI Prediction', labelUr: 'AI پیشگوئی' },
  { path: '/tracker', icon: '❤️', label: 'Health Tracker', labelUr: 'صحت ٹریکر' },
  { path: '/habits', icon: '💧', label: 'Habits', labelUr: 'عادات' },
  { path: '/reports', icon: '📋', label: 'Reports', labelUr: 'رپورٹس' },
  { path: '/profiles', icon: '👨‍👩‍👧‍👦', label: 'Family', labelUr: 'خاندان' },
  { path: '/doctors', icon: '🏥', label: 'Doctors', labelUr: 'ڈاکٹر' },
  { path: '/medicine', icon: '💊', label: 'Medicine', labelUr: 'دوائی' },
  { path: '/diet', icon: '🍽️', label: 'Diet', labelUr: 'غذا' },
  { path: '/first-aid', icon: '🩹', label: 'First Aid', labelUr: 'ابتدائی طبی' },
  { path: '/mental-health', icon: '🧠', label: 'Mental Health', labelUr: 'ذہنی صحت' },
  { path: '/alerts', icon: '🔔', label: 'Alerts', labelUr: 'الرٹس' },
  { path: '/trends', icon: '📈', label: 'Trends', labelUr: 'رجحانات' },
];

const mobileNavItems = [
  { path: '/', icon: '📊', label: 'Home' },
  { path: '/symptoms', icon: '🩺', label: 'Check' },
  { path: '/tracker', icon: '❤️', label: 'Track' },
  { path: '/habits', icon: '💧', label: 'Habits' },
  { path: '/emergency', icon: '🚨', label: 'SOS' },
];

export default function Layout() {
  const { user, userData, logout } = useAuth();
  const { lang, toggleLang } = useLang();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">🌿</div>
          <div className="sidebar-title">
            <h1>Sehat Saathi</h1>
            <span>صحت ساتھی • AI Healthcare</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              end={item.path === '/'}
            >
              <span className="nav-icon">{item.icon}</span>
              {lang === 'ur' ? item.labelUr : item.label}
            </NavLink>
          ))}
          
          <div style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
            <div className="nav-item" onClick={() => { navigate('/emergency'); setSidebarOpen(false); }}
              style={{ color: 'var(--danger)', fontWeight: 700 }}>
              <span className="nav-icon">🚨</span>
              Emergency / ایمرجنسی
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              {user?.displayName?.[0]?.toUpperCase() || '👤'}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{userData?.name || user?.displayName || 'User'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm w-full" onClick={logout}>🚪 Logout</button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <button className="btn btn-ghost btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }} id="menuBtn">
              ☰
            </button>
            <button className="btn btn-ghost btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ fontSize: 20 }}>
              ☰
            </button>
            <span className="topbar-title">🌿 Sehat Saathi</span>
          </div>
          <div className="topbar-right">
            <button className="btn btn-sm btn-outline" onClick={toggleLang}>
              {lang === 'en' ? 'اردو' : 'English'}
            </button>
            <button className="btn btn-sm btn-emergency" onClick={() => navigate('/emergency')}>
              🚨 SOS
            </button>
          </div>
        </div>

        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {mobileNavItems.map(item => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              end={item.path === '/'}>
              <span className="mnav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
