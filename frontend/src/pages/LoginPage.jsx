import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌿</div>
          <h2>Sehat Saathi</h2>
          <p className="auth-subtitle">
            {isSignup ? 'Create your account' : 'Welcome back!'}<br />
            <span className="urdu" style={{ fontSize: 14 }}>
              {isSignup ? 'اکاؤنٹ بنائیں' : 'خوش آمدید!'}
            </span>
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--red-50)', border: '1px solid var(--red-400)', borderRadius: 'var(--radius-sm)',
            padding: '10px 14px', fontSize: 13, color: 'var(--red-600)', marginBottom: 16 }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label className="label">Full Name / نام</label>
              <input className="input" type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Ahmed Khan" required />
            </div>
          )}
          
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required />
          </div>
          
          <div className="form-group">
            <label className="label">Password / پاسورڈ</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Min 6 characters" required minLength={6} />
          </div>

          <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
            {loading ? '⏳' : isSignup ? '🚀 Sign Up / اکاؤنٹ بنائیں' : '🔓 Login / لاگ ان'}
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="google-btn" onClick={handleGoogle} disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google se Login / گوگل سے لاگ ان
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { setIsSignup(!isSignup); setError(''); }}>
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}
