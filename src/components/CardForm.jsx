// src/components/CardForm.jsx
import Field from './Field';

const THEMES = [
  { id: 'night', bg: '#1c1917', label: 'Midnight' },
  { id: 'chalk', bg: '#ffffff', border: '1px solid #ccc', label: 'Clean' },
  { id: 'ocean', bg: '#0f2942', label: 'Ocean' },
  { id: 'sage',  bg: '#1e2d1e', label: 'Sage' },
  { id: 'blush', bg: '#fdf2f0', border: '1px solid #fcd5cc', label: 'Blush' },
  { id: 'dusk',  bg: '#2a1f3d', label: 'Dusk' },
];

export default function CardForm({ form, setField, theme, setTheme, loading }) {
  return (
    <div className="form-col">

      <p className="section-label">Your details</p>

      {loading ? (
        <div className="profile-loading">
          <div className="skeleton sk-name" />
          <div className="skeleton sk-role" />
          <div className="skeleton sk-line" />
          <div className="skeleton sk-line" />
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-avatar">
            {form.fname?.[0]}{form.lname?.[0]}
          </div>
          <div className="profile-info">
            <div className="profile-name">
              {[form.fname, form.lname].filter(Boolean).join(' ') || 'Your Name'}
            </div>
            <div className="profile-role">
              {form.title || 'Job Title'}
              {form.title && form.company ? ' · ' : ''}
              {form.company || ''}
            </div>
          </div>
        </div>
      )}

      <div className="profile-details">
        <DetailRow icon={<EmailIcon />} value={form.email} loading={loading} placeholder="email@company.com" />
        <DetailRow icon={<PhoneIcon />} value={form.phone} loading={loading} placeholder="Phone not set" />
      </div>

      <div className="profile-notice">
        <InfoIcon />
        Details are pulled from your company directory. Contact IT to update them.
      </div>

      <div className="divider" />

      {/* Optional website field */}
      <p className="section-label">Optional</p>
      <Field
        label="Website / LinkedIn"
        id="website"
        value={form.website}
        onChange={setField}
        placeholder="linkedin.com/in/yourname"
      />

      <div className="divider" />

      {/* Theme picker */}
      <p className="section-label">Card theme</p>
      <div className="themes-grid">
        {THEMES.map(t => (
          <div
            key={t.id}
            className={`theme-option${theme === t.id ? ' active' : ''}`}
            onClick={() => setTheme(t.id)}
          >
            <div
              className="theme-swatch-lg"
              style={{
                background: t.bg,
                border: theme === t.id ? '2px solid #1c1917' : (t.border || '2px solid transparent'),
              }}
            >
              <div className="theme-swatch-bar"
                style={{ background: t.id === 'night' ? '#c84b31' : t.id === 'chalk' ? '#1c1917' : t.id === 'ocean' ? '#38bdf8' : t.id === 'sage' ? '#86efac' : t.id === 'blush' ? '#c84b31' : '#a78bfa' }}
              />
            </div>
            <span className="theme-option-label">{t.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

function DetailRow({ icon, value, loading, placeholder }) {
  return (
    <div className="detail-row">
      <span className="detail-icon">{icon}</span>
      {loading
        ? <div className="skeleton sk-line" style={{ flex: 1 }} />
        : <span className="detail-value">{value || <span className="detail-empty">{placeholder}</span>}</span>
      }
    </div>
  );
}

function EmailIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01"/>
    </svg>
  );
}