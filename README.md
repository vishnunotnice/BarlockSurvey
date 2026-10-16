# BarLock Market Validation Survey

A responsive React + TypeScript survey with 30 approved questions, role-based branching, per-question validation, progress tracking, and Google Sheets persistence. A client or coach answers 20 questions: 1–6, their role-specific 10 questions, and 27–30.

## Run locally

1. Install Node.js 20 or newer.
2. In this folder, run `npm install`.
3. Copy `.env.example` to `.env` and add the deployed Apps Script URL after completing the section below.
4. Run `npm run dev`.

For production, run `npm run build`. The deployable static files are created in `dist/`.

## Google Sheets setup and authorization

This design keeps Google credentials out of the website. Google Apps Script runs under the spreadsheet owner's Google authorization and writes directly to the protected spreadsheet.

1. Create a new Google Sheet named **BarLock Survey Responses**. Do not share it publicly.
2. In the sheet choose **Extensions → Apps Script**.
3. Replace the starter code with the contents of `google-apps-script/Code.gs`, then save the project.
4. Click **Run** once and authorize the script with the Google account that owns the spreadsheet. Google will ask to allow spreadsheet access; this is the only account that needs it.
5. Choose **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Copy the `/exec` URL. (A public survey needs an anonymous submission endpoint; the spreadsheet itself remains private.)
6. In the site project, copy `.env.example` to `.env` and paste that URL as `VITE_GOOGLE_APPS_SCRIPT_URL`.
7. Build and deploy the web app. Rebuild whenever the endpoint changes.

On the first real response, the script creates and formats three tabs automatically:

- **All Responses** — every valid submission
- **Client Responses** — client-path responses only
- **Coach Responses** — coach-path responses only

Each row includes a UUID, UTC timestamp, role, and Q1–Q30 as columns. Unshown branch questions remain blank.

## Security notes

- No Google OAuth token, spreadsheet ID, or Google credential is sent to browsers.
- The Sheet stays private; only the Apps Script deployment can append rows.
- The receiver validates the role and all expected answers, uses a script lock to avoid simultaneous-write races, includes a bot honeypot, and neutralizes spreadsheet-formula injection.
- For a high-volume public campaign, add CAPTCHA or move the receiver behind a server endpoint with rate limiting. Apps Script web apps do not provide strong anonymous-user rate limiting by themselves.
