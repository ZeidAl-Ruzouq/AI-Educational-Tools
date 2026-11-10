# Run the tools locally

Both backends use Gemini. Set `GEMINI_API_KEY` and `GEMINI_MODEL` in the terminal that starts each server. Choose a text generation model available to your account from the [Gemini model list](https://ai.google.dev/gemini-api/docs/models). Keep API keys and service account files out of Git.

## School Chat

Install Node.js. For the student view, share a test spreadsheet with a Google Sheets service account. The app looks in `Sheet1!A1:E100` for name, grade, goal, gender, and scores in that order.

From the repo root in PowerShell, run:

```powershell
cd chatbot
npm ci
$env:GEMINI_API_KEY = 'your-gemini-key'
$env:GEMINI_MODEL = 'your-model-id'
$env:GOOGLE_SHEET_ID = 'your-test-sheet-id'
$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\service-account.json'
npm start
```

Open [chatbot/web/mainpage.html](chatbot/web/mainpage.html) in your browser. The page calls the API on port 3000. You can also put the credentials file at `chatbot/g.json` and leave `GOOGLE_APPLICATION_CREDENTIALS` unset. The school chat can answer general questions without the sheet.

## PowerPoint to Quiz

Use Windows with Python and desktop PowerPoint installed. PowerPoint exports the slide previews.

From the repo root in PowerShell, run:

```powershell
cd quiz
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
$env:GEMINI_API_KEY = 'your-gemini-key'
$env:GEMINI_MODEL = 'your-model-id'
.\.venv\Scripts\python.exe PPTX.py
```

Open [quiz/web/PPTX.html](quiz/web/PPTX.html) and upload a practice deck. The page calls the API on port 8000.
