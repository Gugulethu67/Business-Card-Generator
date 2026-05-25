import { useRef } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import QRCodeGen from 'qrcode';
import logo from '../logo/Cape Town Tourism-01.png';

const THEME_STYLES = {
  night: { bg: '#1c1917', text: '#f5f3ef', bar: '#c84b31' },
  chalk: { bg: '#ffffff', text: '#1c1917', bar: '#1c1917' },
  ocean: { bg: '#0f2942', text: '#e8f4fd', bar: '#38bdf8' },
  sage:  { bg: '#1e2d1e', text: '#e8f5e9', bar: '#86efac' },
  blush: { bg: '#fdf2f0', text: '#7c2d1a', bar: '#c84b31' },
  dusk:  { bg: '#2a1f3d', text: '#ede9fe', bar: '#a78bfa' },
};

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

// Load image as base64 for jsPDF
function loadImageAsBase64(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = src;
  });
}

export default function CardPreview({ form, theme, vcard }) {
  const cardRef = useRef(null);

  const display = {
    name:    [form.fname, form.lname].filter(Boolean).join(' ') || 'Your Name',
    title:   form.title   || 'Job Title',
    company: form.company || 'Cape Town Tourism',
    email:   form.email   || 'email@capetown.travel',
    phone:   form.phone,
    website: form.website,
  };

  async function handleDownloadPDF() {
    const t = THEME_STYLES[theme] || THEME_STYLES.chalk;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 53.98] });

    // Background
    pdf.setFillColor(...hexToRgb(t.bg));
    pdf.roundedRect(0, 0, 85.6, 53.98, 2, 2, 'F');

    // Accent bar
    pdf.setFillColor(...hexToRgb(t.bar));
    pdf.rect(0, 0, 85.6, 1.5, 'F');

    const [tr, tg, tb] = hexToRgb(t.text);

    // Logo in PDF (top left)
    try {
      const logoBase64 = await loadImageAsBase64(logo);
      // Logo aspect ratio is 406x298 ~ 1.36:1, render at height 10mm
      pdf.addImage(logoBase64, 'PNG', 5, 3, 13.6, 10);
    } catch (e) {
      // Fallback to text if logo fails
      pdf.setTextColor(tr, tg, tb);
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'bold');
      pdf.text(display.company.toUpperCase(), 6, 9);
    }

    // Full name
    pdf.setTextColor(tr, tg, tb);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(display.name, 6, 27);

    // Job title
    pdf.setFontSize(7.5);
    pdf.text(display.title, 6, 32);

    // Contact lines
    pdf.setFontSize(6.5);
    let y = 40;
    if (display.email)  { pdf.text(display.email, 6, y); y += 3.5; }
    if (display.phone)  { pdf.text(display.phone, 6, y); y += 3.5; }
    pdf.text('33 Martin Hammerschlag Way, Cape Town City Center', 6, y); y += 3.5;
    pdf.text('0861 322 223', 6, y); y += 3.5;
    pdf.text('capetown.travel', 6, y);
    

    // QR code
    try {
      const qrDataUrl = await QRCodeGen.toDataURL(vcard, {
        width: 500,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#ffffff' },
      });
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(67, 35, 15, 15, 1, 1, 'F');
      pdf.addImage(qrDataUrl, 'PNG', 67.5, 35.5, 14, 14);
    } catch (e) {
      console.error('QR error', e);
    }

    pdf.save(`${form.fname || 'card'}_${form.lname || ''}.pdf`);
  }

  function handleDownloadQR() {
    QRCodeGen.toDataURL(vcard, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#000000', light: '#ffffff' },
    }).then(url => {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.fname || 'qr'}_qr.png`;
      a.click();
    });
  }

  return (
    <div className="preview-col">
      {/* Card */}
      <div className="card-scene">
        <div ref={cardRef} className={`business-card theme-${theme}`}>
          <div className="card-bar" />

          {/* Logo replaces company name */}
          <div className="card-logo-wrap">
            <img src={logo} alt="Cape Town Tourism" className="card-logo" />
          </div>

          <div>
            <div className="card-name">{display.name}</div>
            <div className="card-role">{display.title}</div>
          </div>
          <div className="card-footer">
            <div className="card-contacts">
              <div className="card-contact-line">{display.email}</div>
              {display.phone && <div className="card-contact-line">{display.phone}</div>}
              <div className="card-contact-line">📍 33 Martin Hammerschlag Way, Cape Town City Center</div>
              <div className="card-contact-line">📞 0861 322 223</div>
              <div className="card-contact-line">🌐 capetown.travel</div>
            </div>
            <QRCode value={vcard} size={46} level="H" />
          </div>
        </div>
      </div>

      {/* Large QR */}
      <div className="qr-panel">
        <div id="big-qr">
          <QRCode value={vcard} size={88} level="H" style={{ borderRadius: 6 }} />
        </div>
        <div className="qr-text">
          <p>
            <strong>Scan to save contact</strong>
            Colleagues scan this with their phone camera — it opens the contact details instantly, ready to save.
          </p>
        </div>
      </div>

      {/* Download buttons */}
      <div className="download-row">
        <button className="btn btn-primary" onClick={handleDownloadPDF}>
          <DownloadIcon /> Download PDF
        </button>

        <button className="btn btn-ghost" onClick={handleDownloadQR}>
          <QRIcon /> QR image
        </button>
      </div>

      <div className="address-panel">
        <div className="address-grid">
          <div className="address-block">
            <p className="address-heading">City Hall Visitor Experience</p>
            <p className="address-line">📍 Darling Street, Cape Town</p>
            <p className="address-line">Mon – Fri: 08:00 – 17:00</p>
            <p className="address-line">Saturdays: 08:30 – 15:00</p>
            <p className="address-line">Sundays & Public Holidays: 09:00 – 13:00</p>
          </div>
          <div className="address-block">
            <p className="address-heading">Airport Visitor Experience</p>
            <p className="address-line">Mon – Sun (incl. Public Holidays)</p>
            <p className="address-line">07:00 – 20:00</p>
            <p className="address-line">✉ airport@capetown.travel</p>
            <p className="address-line">📞 086 132 2223</p>
          </div>
          <div className="address-block">
            <p className="address-heading">General Contact</p>
            <p className="address-line">✉ info@capetown.travel</p>
            <p className="address-line">✉ airport@capetown.travel</p>
            <p className="address-line">📞 0861 322 223</p>
            <p className="address-line">📮 PO Box 1403, Cape Town 8000</p>
          </div>
        </div>
      </div>

      <div className="tip-box">
        <strong>Tip:</strong> Share the PDF for printing, the .vcf for digital contacts, and the QR image over Teams or WhatsApp.
        Windows users: right-click the .vcf → <strong>Open with</strong> → Outlook or People app.
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 16l-4-4h3V4h2v8h3l-4 4z" /><path d="M4 20h16" />
    </svg>
  );
}
function QRIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" />
    </svg>
  );
}