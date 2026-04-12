import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import './AuthModal.css';

export default function AuthModal() {
  const { login, register, isLoading } = useAuth();
  const { closeAuthModal } = useAuthModal();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [hasCallback, setHasCallback] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');

  useEffect(() => {
    function onOpen(e: Event) {
      const custom = e as CustomEvent<{ onSuccess?: boolean }>;
      setHasCallback(!!custom.detail?.onSuccess);
      setIsOpen(true);
    }
    function onClose() {
      setIsOpen(false);
      setHasCallback(false);
    }
    window.addEventListener('open_auth_modal', onOpen);
    window.addEventListener('close_auth_modal', onClose);
    return () => {
      window.removeEventListener('open_auth_modal', onOpen);
      window.removeEventListener('close_auth_modal', onClose);
    };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    console.log('handleLogin called', { email: loginEmail, password: loginPassword });
    try {
      setError(null);
      const result = await login(loginEmail, loginPassword);
      console.log('login result', result);
      if (result.success) {
        if (hasCallback) sessionStorage.removeItem('auth_callback');
        closeAuthModal();
      } else {
        setError(result.error ?? 'Login failed');
      }
    } catch (err) {
      console.error('handleLogin error', err);
      setError('An error occurred. Please try again.');
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!regFirstName || !regLastName) {
      setError('Please fill in all fields');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const result = await register(regEmail, regPassword, regConfirmPassword, regFirstName, regLastName);
    if (result.success) {
      if (hasCallback) sessionStorage.removeItem('auth_callback');
      closeAuthModal();
    } else {
      setError(result.error ?? 'Registration failed');
    }
  }

  function handleClose() {
    closeAuthModal();
  }

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={handleClose} aria-label="Close">
          &times;
        </button>

        <div className="auth-modal__tabs">
          <button
            className={`auth-modal__tab ${mode === 'login' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => { setMode('login'); setError(null); setRegConfirmPassword(''); setShowLoginPassword(false); setShowRegisterPassword(false); setShowConfirmPassword(false); }}
          >
            Sign In
          </button>
          <button
            className={`auth-modal__tab ${mode === 'register' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => { setMode('register'); setError(null); setRegConfirmPassword(''); setShowConfirmPassword(false); }}
          >
            Create Account
          </button>
        </div>

        <div className="auth-modal__title">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </div>
        <div className="auth-modal__sub">
          {mode === 'login'
            ? 'Sign in to access your account and orders'
            : 'Join MELiZZO for exclusive chocolate experiences'}
        </div>

        {error && (
          <div className="auth-modal__error">{error}</div>
        )}

        {mode === 'login' ? (
          <form className="auth-modal__form" onSubmit={handleLogin}>
            <div className="auth-modal__field">
              <label>Email</label>
              <input
                type="email"
                className="auth-modal__input"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoFocus
              />
            </div>
            <div className="auth-modal__field">
              <label>Password</label>
              <div className="auth-modal__password-wrapper">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  className="auth-modal__input"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  className="auth-modal__password-toggle"
                  onClick={() => setShowLoginPassword(v => !v)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-modal__submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <button
              type="button"
              className="auth-modal__switch"
              onClick={() => { setMode('register'); setError(null); setRegConfirmPassword(''); setShowConfirmPassword(false); }}
            >
              Don&apos;t have an account? Create one
            </button>
          </form>
        ) : (
          <form className="auth-modal__form" onSubmit={handleRegister}>
            <div className="auth-modal__row">
              <div className="auth-modal__field">
                <label>First Name</label>
                <input
                  type="text"
                  className="auth-modal__input"
                  value={regFirstName}
                  onChange={e => setRegFirstName(e.target.value)}
                  placeholder="First name"
                  required
                  autoFocus
                />
              </div>
              <div className="auth-modal__field">
                <label>Last Name</label>
                <input
                  type="text"
                  className="auth-modal__input"
                  value={regLastName}
                  onChange={e => setRegLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div className="auth-modal__field">
              <label>Email</label>
              <input
                type="email"
                className="auth-modal__input"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="auth-modal__field">
              <label>Password</label>
              <div className="auth-modal__password-wrapper">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  className="auth-modal__input"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Min. 8 chars, uppercase, lowercase, number"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="auth-modal__password-toggle"
                  onClick={() => setShowRegisterPassword(v => !v)}
                  aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                >
                  {showRegisterPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="auth-modal__field">
              <label>Confirm Password</label>
              <div className="auth-modal__password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="auth-modal__input"
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="auth-modal__password-toggle"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-modal__submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
            <button
              type="button"
              className="auth-modal__switch"
              onClick={() => { setMode('login'); setError(null); setRegConfirmPassword(''); setShowLoginPassword(false); setShowRegisterPassword(false); setShowConfirmPassword(false); }}
            >
              Already have an account? Sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
