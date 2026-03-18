# CE210T · ICT Quiz — Complete Setup & Update Guide
## ITU · Faculty of Engineering

---

## WHAT THIS QUIZ DOES

- 30 questions across 6 topics from Lecture 3 (Slides 1–18)
- 15 randomly selected per student attempt
- 60 seconds per question (home exam setting)
- One attempt per roll number (enforced at both frontend + backend)
- Tab-switching detection and recording
- Auto-submits score to Google Sheets gradebook
- Shows per-topic performance breakdown in results

---

## PART 1 — GOOGLE SHEETS SETUP (10 min, one-time)

### Step 1 · Create Spreadsheet
1. Go to sheets.google.com → New spreadsheet
2. Name it: **CE210T ICT Quiz Results**

### Step 2 · Add Apps Script
1. Extensions → Apps Script
2. Delete existing code
3. Paste this entire script:

```javascript
const SHEET_NAME  = "Responses";
const MARKS_SHEET = "Marksheet";
const HEADERS = ["Timestamp","Start Time","Name","Roll Number","Score","Total","Percentage (%)","Tab Warnings","Detailed Answers"];

function doGet(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  const params = e.parameter;
  if (params.action === "check" && params.roll) {
    const sheet = getOrCreateSheet(SHEET_NAME);
    const data  = sheet.getDataRange().getValues();
    const exists = data.slice(1).some(row => String(row[3]).toUpperCase() === params.roll.toUpperCase());
    output.setContent(JSON.stringify({ exists }));
  } else {
    output.setContent(JSON.stringify({ status: "ok" }));
  }
  return output;
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.action === "submit") {
    const sheet = getOrCreateSheet(SHEET_NAME);
    const existing = sheet.getDataRange().getValues();
    const alreadyExists = existing.slice(1).some(
      row => String(row[3]).toUpperCase() === String(data.rollNumber).toUpperCase()
    );
    if (alreadyExists) {
      return ContentService.createTextOutput(JSON.stringify({ status: "duplicate" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    sheet.appendRow([data.timestamp, data.startTime, data.name, data.rollNumber,
      data.score, data.total, data.percentage, data.tabWarnings, data.answers]);
    syncMarksheet();
    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "error" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function syncMarksheet() {
  const responses = getOrCreateSheet(SHEET_NAME);
  const marksheet = getOrCreateSheet(MARKS_SHEET);
  const msHeaders = ["Roll Number","Name","Score","Total","Percentage (%)","Grade","Tab Warnings","Submitted At"];
  if (marksheet.getLastRow() === 0) {
    marksheet.appendRow(msHeaders);
    marksheet.getRange(1,1,1,msHeaders.length).setFontWeight("bold");
    marksheet.setFrozenRows(1);
  }
  const data = responses.getDataRange().getValues().slice(1);
  const rows = data.map(row => {
    const pct   = Number(row[6]);
    const grade = pct>=80?"A":pct>=70?"B":pct>=60?"C":pct>=50?"D":"F";
    return [row[3], row[2], row[4], row[5], row[6], grade, row[7], row[0]];
  });
  if (marksheet.getLastRow() > 1)
    marksheet.getRange(2,1,marksheet.getLastRow()-1,8).clearContent();
  if (rows.length > 0)
    marksheet.getRange(2,1,rows.length,8).setValues(rows);
  rows.forEach((row,i) => {
    const cell  = marksheet.getRange(i+2,6);
    const grade = row[5];
    const color = grade==="A"?"#d9f2e6":grade==="B"?"#d6eaff":grade==="C"?"#fff9cc":grade==="D"?"#ffe6cc":"#ffd6d6";
    cell.setBackground(color);
  });
}

function getOrCreateSheet(name) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === SHEET_NAME) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1,1,1,HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}
```

4. Click Save (💾)

### Step 3 · Deploy
1. Deploy → New deployment
2. Type: **Web app**
3. Execute as: **Me** | Who has access: **Anyone**
4. Click **Deploy** → Authorize → Copy the **Web App URL**

### Step 4 · Test it
Paste in browser (replace URL):
```
https://script.google.com/macros/s/YOUR_ID/exec?action=check&roll=TEST
```
Should return: `{"exists":false}` ✅

---

## PART 2 — DEPLOY TO VERCEL (5 min)

### Step 1 · Paste your Apps Script URL
Open `src/App.jsx` and find line:
```javascript
const SHEET_URL = "YOUR_APPS_SCRIPT_URL_HERE";
```
Replace with your actual URL from Part 1.

### Step 2 · Upload to GitHub
1. Go to github.com/new → name: `ict-quiz` → Public → Create
2. Click "uploading an existing file"
3. Drag and drop ALL files from this folder
4. Commit changes

### Step 3 · Deploy on Vercel
1. Go to vercel.com → sign in with GitHub
2. Add New → Project → Import `ict-quiz`
3. Leave all settings default → Deploy
4. Get URL: `ict-quiz-yourname.vercel.app` ← share this with students!

---

## PART 3 — HOW TO UPDATE THE QUIZ

### ══ Scenario A: Add new questions to existing quiz ══

Open `src/questions.js` and add to the array:

```javascript
{
  id: 31,                        // ← next number after last (currently 30)
  topic: "Machine Cycle",        // ← must match existing topic name exactly
  question: "Your question here?",
  options: [
    "Wrong answer 1",
    "Correct answer",             // ← position doesn't matter, it gets shuffled
    "Wrong answer 2",
    "Wrong answer 3",
  ],
  answer: "Correct answer",       // ← must match one option exactly
  explanation: "Explanation shown after student answers.",
},
```

**Rules:**
- `id` must be unique — just keep counting up
- `answer` must be an exact copy of one of the four `options`
- `topic` must exactly match one of the 6 topic names (case-sensitive) or add a new color in the `TOPIC_COLORS` object in `App.jsx`
- You can have as many questions as you want in the pool — the quiz randomly picks `QUIZ_SIZE` of them

---

### ══ Scenario B: Create a NEW quiz for next lecture ══

**Option 1 — Same Vercel project (update in place)**

1. Replace all content of `src/questions.js` with new questions
2. Update these lines at the top of `src/App.jsx`:

```javascript
const QUIZ_TITLE = "Lecture 4 Quiz";          // ← change title
const QUIZ_SUB   = "Topic A · Topic B · ..."; // ← change subtitle
const QUIZ_SIZE  = 12;                         // ← change if needed
const TIME_PER_Q = 60;                         // ← change if needed
```

3. Also update `TOPIC_COLORS` in `App.jsx` for any new topic names:
```javascript
const TOPIC_COLORS = {
  "New Topic Name": "#ff6b6b",   // ← add your color
  // ... existing topics
};
```

4. Push to GitHub → Vercel auto-redeploys in ~1 min
5. ⚠️ If you want a FRESH gradebook, create a new Google Sheet + new deployment URL

**Option 2 — Separate Vercel project (keep lectures separate)**

1. Duplicate the entire folder → rename `ict-quiz-lec4`
2. Edit `src/questions.js` with new questions
3. Edit the 4 config lines in `src/App.jsx`
4. Create new Google Sheet + Apps Script + new URL
5. Paste new URL into `App.jsx`
6. Push to new GitHub repo → new Vercel project
7. New URL: `ict-quiz-lec4-yourname.vercel.app`

---

### ══ Scenario C: Change quiz settings ══

All settings are at the TOP of `src/App.jsx`:

```javascript
const SHEET_URL  = "...";          // Google Apps Script URL
const QUIZ_SIZE  = 15;             // How many questions per attempt
const TIME_PER_Q = 60;             // Seconds per question
const COURSE     = "CE210T · ..."; // Shown in header
const QUIZ_TITLE = "Lecture 3 ...";// Main title
const QUIZ_SUB   = "CPU · ...";    // Subtitle
```

After any change → push to GitHub → Vercel redeploys automatically.

---

### ══ Scenario D: Reset student attempts ══

If a student needs a second attempt (e.g., technical issue):
1. Open your Google Sheet → Responses tab
2. Find and delete their row
3. The Marksheet auto-updates next time any student submits
4. Student can now attempt again

---

## PART 4 — UNDERSTANDING YOUR GRADEBOOK

### Responses Tab (raw data)
Every submission creates one row:

| Timestamp | Start Time | Name | Roll | Score | Total | % | Tab Switches | Answers |
|-----------|-----------|------|------|-------|-------|---|--------------|---------|
| 2026-03-05 10:22 | 10:20 | Ali | 23-CE-001 | 12 | 15 | 80 | 0 | [...] |

### Marksheet Tab (auto-formatted gradebook)
| Roll Number | Name | Score | Total | % | Grade | Tab Warnings | Submitted |
|-------------|------|-------|-------|---|-------|--------------|-----------|
| 23-CE-001 | Ali | 12 | 15 | 80 | **A** 🟢 | 0 | ... |

Grades: A=80%+ · B=70% · C=60% · D=50% · F=below 50%

---

## QUICK REFERENCE — Files in This Folder

```
ict-quiz/
├── index.html              ← Browser tab title
├── package.json            ← Dependencies (don't change)
├── vite.config.js          ← Build config (don't change)
├── SETUP.md                ← This file
└── src/
    ├── main.jsx            ← React entry (don't change)
    ├── App.jsx             ← CONFIGURATION + UI (change top 6 lines)
    └── questions.js        ← ALL QUESTIONS (edit freely)
```

### The Golden Rule
> **Only ever edit `src/questions.js` and the top 6 lines of `src/App.jsx`.**
> Everything else is infrastructure — leave it alone.

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| `{"error":"Unknown action"}` when testing URL bare | Normal — test with `?action=check&roll=TEST` |
| Score not appearing in Sheet | Re-deploy Apps Script as a new version |
| Student says "already attempted" but hasn't | Delete their row from Responses tab |
| Vercel build fails | Check package.json and vite.config.js are in root folder |
| Questions not randomizing | Clear browser cache |
