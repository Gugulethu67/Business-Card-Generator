export function buildVCard({ fname, lname, title, company, email, phone, website }) {
  const fullName = `${fname || 'Your'} ${lname || 'Name'}`.trim();
  let vc = `BEGIN:VCARD\nVERSION:3.0\n`;
  vc += `FN:${fullName}\n`;
  vc += `N:${lname || ''};${fname || ''};;;\n`;
  if (title)   vc += `TITLE:${title}\n`;
  if (company) vc += `ORG:${company}\n`;
  if (email)   vc += `EMAIL:${email}\n`;
  if (phone)   vc += `TEL:${phone}\n`;
  if (website) vc += `URL:${website.startsWith('http') ? website : 'https://' + website}\n`;
  vc += `END:VCARD`;
  return vc;
}

export function downloadVCF(vcard, fname, lname) {
  const blob = new Blob([vcard], { type: 'text/vcard' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${fname || 'contact'}_${lname || ''}.vcf`;
  a.click();
  URL.revokeObjectURL(a.href);
}
