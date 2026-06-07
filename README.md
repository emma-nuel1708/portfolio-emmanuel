# Zector Portfolio Full-Stack Rebuild

React + Node/Express rebuild of `https://emmanuel-portfolio-rho.vercel.app/`.

## Run Locally

```bash
npm install
npm run dev
```

The development script starts:

- React/Vite frontend: `http://localhost:5173`
- Express API backend: `http://localhost:5000`

For the production-style local server:

```bash
npm run build
npm start
```

Then open `http://localhost:5000`.

## API

- `GET /api/health` checks the backend.
- `GET /api/portfolio` returns the portfolio content.
- `POST /api/contact` validates and stores contact form submissions.

## Send Contact Form To Google Sheets

1. Create a Google Sheet.
2. In the sheet, go to `Extensions` > `Apps Script`.
3. Paste the code from `google-apps-script.js`.
4. Click `Deploy` > `New deployment`.
5. Choose `Web app`.
6. Set `Execute as` to `Me`.
7. Set `Who has access` to `Anyone`.
8. Deploy and copy the Web App URL.
9. Create a `.env` file in this project, or copy `.env.example`:

```bash
PORT=5000
GOOGLE_SHEET_WEBHOOK_URL=PASTE_YOUR_WEB_APP_URL_HERE
```

10. Restart the dev server:

```bash
npm run dev
```

The backend still keeps a local backup in `server/messages.json`.
