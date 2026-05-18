import { useState } from "react";

const THEMES = [
  { id: 'navy',    bg: '#1d2b6b' },
  { id: 'teal',    bg: '#1a8f8f' },
  { id: 'magenta', bg: '#e8174a' },
  { id: 'topbar',  bg: '#1d3557' },
  { id: 'white',   bg: '#ffffff', border: '1px solid #ccc' },
  { id: 'cream',   bg: '#fdf6f0', border: '1px solid #fcd5cc' },
];

function Field({ label, id, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(id, e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}

export default function CardForm({ form, setField, theme, setTheme }) {
  return (
    <div className="form-col">
      <p className="section-label">Personal details</p>

      <div className="row2">
        <Field label="First name" id="fname" value={form.fname} onChange={setField} placeholder="Sarah" />
        <Field label="Last name"  id="lname" value={form.lname} onChange={setField} placeholder="Johnson" />
      </div>

      <Field label="Job title"            id="title"   value={form.title}   onChange={setField} placeholder="Senior Product Manager" />
      <Field label="Company / Department" id="company" value={form.company} onChange={setField} placeholder="Cape Town Tourism" />

      <div className="divider" />

      <p className="section-label">Contact info</p>

      <Field label="Email"   id="email"   value={form.email}   onChange={setField} placeholder="sarah@capetown.travel" type="email" />
      <div className="row2">
        <Field label="Phone"   id="phone"   value={form.phone}   onChange={setField} placeholder="+27 21 000 0000" />
        <Field label="Website" id="website" value={form.website} onChange={setField} placeholder="https://www.capetown.travel/" />
      </div>

      <div className="divider" />

      <p className="theme-label">Card theme</p>
      <div className="themes-row">
        {THEMES.map(t => (
          <div
            key={t.id}
            className={`swatch${theme === t.id ? ' active' : ''}`}
            style={{
              background: t.bg,
              border: theme === t.id
                ? '2px solid #e8174a'
                : (t.border || 'none'),
            }}
            onClick={() => setTheme(t.id)}
            title={t.id.charAt(0).toUpperCase() + t.id.slice(1)}
          />
        ))}
      </div>
    </div>
  );
}