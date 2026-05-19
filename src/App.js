// src/App.js
import { useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from './authConfig';
import { getUserProfile } from './utils/graphApi';
import CardForm from './components/CardForm';
import CardPreview from './components/CardPreview';
import { buildVCard } from './utils/vcard';
import './App.css';
import CapeTownTourismLogo from './logo/Cape Town Tourism-01.png';

const DEFAULT_FORM = {
  fname: '', lname: '', title: '', company: '',
  email: '', phone: '', website: '',
};

export default function App() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [theme, setTheme] = useState('night');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const vcard = buildVCard(form);

  useEffect(() => {
    if (!isAuthenticated || accounts.length === 0 || inProgress !== InteractionStatus.None) return;

    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        const profile = await getUserProfile(tokenResponse.accessToken);
        setForm(prev => ({ ...prev, ...profile }));
      } catch (err) {
        console.error(err);
        try {
          await instance.acquireTokenRedirect({ ...loginRequest, account: accounts[0] });
        } catch (e) {
          setError('Could not load your profile. Please sign out and try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isAuthenticated, accounts, inProgress, instance]);

  function handleLogin() {
    instance.loginRedirect(loginRequest).catch(err => {
      console.error(err);
      setError('Login failed: ' + err.message);
    });
  }

  function handleLogout() {
    instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
  }

  const isLoggingIn = inProgress === InteractionStatus.Login ||
                      inProgress === InteractionStatus.HandleRedirect;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <img src={CapeTownTourismLogo} alt="Cape Town Tourism" style={{ width: 68, height: 50 }} />
        <h1 className="topbar-title">Business Card Generator</h1>
        <div className="topbar-right">
          {(loading || isLoggingIn) && (
            <span className="topbar-loading">{isLoggingIn ? 'Signing in...' : 'Loading profile...'}</span>
          )}
          {isAuthenticated && accounts[0] && !loading && (
            <span className="topbar-user">{accounts[0].name}</span>
          )}
          {isAuthenticated && (
            <button className="btn-signout" onClick={handleLogout}>Sign out</button>
          )}
        </div>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <UnauthenticatedTemplate>
        <div className="login-screen">
          <div className="login-card">
              <img src={CapeTownTourismLogo} alt="Cape Town Tourism" style={{ width: 88, height: 88 }} />
            <h2 className="login-title">Business Card Generator</h2>
            <p className="login-subtitle">
              Sign in with your Cape Town Tourism Microsoft account to generate your digital business card. Your details will be filled in automatically.
            </p>
            {error && <p className="login-error">{error}</p>}
            <button className="btn-microsoft" onClick={handleLogin} disabled={isLoggingIn}>
              <MicrosoftIcon />
              {isLoggingIn ? 'Signing in...' : 'Sign in with Microsoft'}
            </button>
          </div>
        </div>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <div className="layout-wrapper">
          <main className="layout">
          <CardForm form={form} setField={setField} theme={theme} setTheme={setTheme} vcard={vcard} loading={loading} />
          <CardPreview form={form} theme={theme} vcard={vcard} />
                  </main>
        </div>
      </AuthenticatedTemplate>
    </div>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
      <rect x="1"  y="1"  width="9" height="9" fill="#f25022"/>
      <rect x="11" y="1"  width="9" height="9" fill="#00a4ef"/>
      <rect x="1"  y="11" width="9" height="9" fill="#7fba00"/>
      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
    </svg>
  );
}




