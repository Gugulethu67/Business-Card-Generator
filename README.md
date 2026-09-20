# Business Card Generator

A self-service web app that generates branded digital business cards. Employees sign in with their Microsoft work account and their card is built automatically from the company directory, ready to download as a print-quality PDF or share as a scannable QR code.



## Why it exists

Business cards go stale. Someone changes role, a phone number updates, a new starter joins, and each change means another round trip to a designer and a print order. Meanwhile the correct details already exist in one place: the company directory.

This app treats that directory as the source of truth. Staff sign in, their current details are pulled from Microsoft Graph, and they get a correctly branded card in under a minute without a designer, a print queue, or the chance to typo their own email address.

## How it works

1. **Sign in.** Microsoft Entra ID authentication via MSAL, using the redirect flow.
2. **Auto-fill.** The app calls Microsoft Graph (`/me`) and maps the response onto the card: display name, job title, department, work email and phone.
3. **Customise.** Pick one of six card themes. Optionally add a website or LinkedIn URL, the only field a user can edit.
4. **Export.** Download a print-ready PDF, or a standalone QR image to share over Teams or WhatsApp.

## Features

- **Microsoft 365 single sign-on**, so there is no separate account to create or password to manage
- **Directory-driven fields**, meaning cards cannot drift out of sync with the official record
- **Six card themes**, light and dark
- **Live preview** that updates as you change theme or add a link
- **Vector PDF export** at true business card dimensions
- **vCard QR code** that opens the contact ready to save when scanned
- **Standalone QR download** as a PNG for digital sharing


### The directory is the source of truth, not the user

Name, title, department, email and phone are read-only in the interface. Only the optional website field is editable.

This is a deliberate constraint rather than a missing feature. The moment users can type their own job title, cards stop matching the official record and the tool becomes another source of inconsistent contact details instead of a fix for one. Users who need a correction are pointed at IT, where the change belongs and where it will propagate everywhere else too.

### The PDF is drawn, not screenshotted

The obvious approach to "download this card as a PDF" is to rasterise the preview with something like html2canvas and drop the resulting image into a page. That produces a screenshot: blurry at print resolution, and sized to whatever the browser rendered rather than to a real card.

Instead, `jsPDF` draws the card programmatically at 85.6 x 65 mm, placing vector text, the accent bar, the logo and the QR code at measured positions. The output is genuine print artwork with selectable text, not a picture of a web page.

### The QR code carries a vCard, not a URL

The QR encodes a complete vCard 3.0 record rather than pointing at a hosted profile page.

This means the card works with no server behind it, no link that can break when hosting changes, and no network needed at the moment of scanning. Someone scans it at a conference with bad signal and the contact still opens, ready to save. Error correction is set to level H so the code survives printing and imperfect scans.

### No backend at all

Authentication, the Graph call, PDF generation and QR encoding all happen in the browser. MSAL handles tokens client side, and the app is deployed as static files.

The practical consequences: nothing to host beyond a CDN, no server to secure or patch, and no contact data stored anywhere outside the user's own session and the files they download.

## Tech stack

| Area | Choice |
|---|---|
| Framework | React 19 (Create React App) |
| Authentication | `@azure/msal-browser`, `@azure/msal-react` |
| Directory data | Microsoft Graph API (`User.Read`) |
| PDF generation | `jsPDF` |
| QR codes | `qrcode`, `qrcode.react` |
| Hosting | Netlify |

## Running locally

### Prerequisites

- Node.js 18 or later
- An Azure app registration in your own Microsoft Entra tenant

### Azure app registration

This app authenticates against a specific tenant, so you will need your own registration before it will run:

1. In the Azure portal, go to **Microsoft Entra ID** then **App registrations** then **New registration**
2. Under **Redirect URI**, choose platform **Single-page application (SPA)** and add `http://localhost:3000`
3. Under **API permissions**, add the Microsoft Graph delegated permission **User.Read**
4. Copy the **Application (client) ID** and **Directory (tenant) ID** from the overview page

Then update `src/authConfig.js` with those two values.

### Install and run

```bash
git clone https://github.com/Gugulethu67/Business-Card-Generator.git
cd Business-Card-Generator
npm install
npm start
```

The app runs at `http://localhost:3000`.

To produce a production build:

```bash
npm run build
```

### Deploying

Add your production URL as a second SPA redirect URI in the app registration. The app reads `window.location.origin` at runtime, so the same build works on localhost and on the deployed site without configuration changes.

## Project structure

```
src/
├── App.js                      Auth state, profile fetch, layout
├── authConfig.js               MSAL and Graph configuration
├── components/
│   ├── CardForm.jsx            Profile summary, website field, theme picker
│   ├── CardPreview.jsx         Live card, QR codes, PDF and QR export
│   └── Field.jsx               Labelled input
└── utils/
    ├── graphApi.js             Graph /me call and field mapping
    └── vcard.js                vCard 3.0 string builder
```

## Possible improvements

- Move the client and tenant IDs into environment variables so the repo is reusable without editing source
- Add a `.vcf` file download alongside the QR code, for desktop users who would rather not scan anything
- Let users pick a profile photo from Graph to include on the card
- Support additional office locations rather than the current hardcoded contact block
