// src/utils/vcard.js

export function buildVCard({ fname, lname, title, company, email, phone, website }) {
  const fullName = `${fname || 'Your'} ${lname || 'Name'}`.trim();
  let vc = `BEGIN:VCARD\r\nVERSION:3.0\r\n`;
  vc += `FN:${fullName}\r\n`;
  vc += `N:${lname || ''};${fname || ''};;;\r\n`;
  if (title)   vc += `TITLE:${title}\r\n`;
  if (company) vc += `ORG:${company}\r\n`;
  if (email)   vc += `EMAIL;TYPE=INTERNET;TYPE=WORK:${email}\r\n`;
  if (phone)   vc += `TEL;TYPE=WORK,VOICE:${phone}\r\n`;
  if (website) vc += `URL:${website.startsWith('http') ? website : 'https://' + website}\r\n`;
  vc += `END:VCARD\r\n`;
  return vc;
}

export function downloadVCF(vcard, fname, lname) {
  // text/vcard is the correct MIME type phones recognise
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fname || 'contact'}_${lname || ''}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}