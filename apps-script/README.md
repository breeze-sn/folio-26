# Google Apps Script Contact Form Backend

Use this Apps Script to store contact form submissions from the portfolio site into Google Sheets.

## Setup

1. Create a Google Sheet.
2. Open **Extensions > Apps Script**.
3. Paste the contents of `Code.gs` into the Apps Script editor.
4. Make sure the sheet tab you want to receive submissions is named `Folio'26`.
5. Deploy the script as a **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the web app URL and add it to your frontend environment as `VITE_APPS_SCRIPT_URL`.
7. Redeploy the web app any time `Code.gs` changes; the live URL keeps serving the last deployed version.

## Frontend env example

Create a `.env` file at the project root:

```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Expected fields

The form sends:

- `name`
- `email`
- `message`
- `source`

The script stores them with a timestamp in the sheet.

It also emails each submission to `nagekarsimran@outlook.com`.
