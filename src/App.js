import { useState } from 'react';
import CardForm from './components/CardForm';
import CardPreview from './components/CardPreview';
import { buildVCard } from './utils/vcard';
import './App.css';

const DEFAULT_FORM = {
  fname: '', lname: '', title: '', company: '',
  email: '', phone: '', website: '',
};

export default function App() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [theme, setTheme] = useState('night');

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const vcard = buildVCard(form);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <rect x="3" y="3" width="8" height="5" rx="1" />
            <rect x="3" y="11" width="8" height="10" rx="1" />
            <rect x="13" y="3" width="8" height="10" rx="1" />
            <rect x="13" y="16" width="8" height="5" rx="1" />
          </svg>
        </div>
        <h1 className="topbar-title">Business Card Generator</h1>
        <span className="topbar-pill">Cape Town Tourism</span>
      </header>

      <main className="layout">
        <CardForm
          form={form}
          setField={setField}
          theme={theme}
          setTheme={setTheme}
          vcard={vcard}
        />
        <CardPreview form={form} theme={theme} vcard={vcard} />
      </main>
    </div>
  );
}
