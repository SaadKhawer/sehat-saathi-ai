import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('❌ App Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg)', padding: 24, textAlign: 'center',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>
            Kuch masla aaya / Something went wrong
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8, direction: 'rtl', fontFamily: 'serif' }}>
            ایک خرابی آئی — صفحہ دوبارہ لوڈ کریں
          </p>
          <p style={{
            background: '#fee', border: '1px solid #fcc', borderRadius: 8,
            padding: '10px 16px', fontSize: 12, color: '#c00',
            maxWidth: 500, marginBottom: 20, textAlign: 'left', wordBreak: 'break-all'
          }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            style={{
              background: 'var(--primary)', color: 'white', border: 'none',
              borderRadius: 10, padding: '12px 28px', fontSize: 14,
              fontWeight: 700, cursor: 'pointer'
            }}
          >
            🔄 Dashboard pe Wapis Jao
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
