/* BarLock Survey receiver — attach this script to the target Google Sheet. */
const SHEETS = { all: 'All Responses', client: 'Client Responses', coach: 'Coach Responses' };
const QUESTION_IDS = Array.from({ length: 30 }, (_, i) => `q${i + 1}`);
const HEADERS = ['Response ID', 'Submitted at (UTC)', 'Role', ...QUESTION_IDS.map(id => id.toUpperCase())];

function doGet() {
  return json_({ ok: true, service: 'BarLock survey receiver' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    // Honeypot bots are accepted silently but never stored.
    if (data.website) return json_({ ok: true });
    if (!data.responseId || !/^[0-9a-f-]{36}$/i.test(data.responseId)) throw new Error('Invalid response ID');
    if (data.role !== 'client' && data.role !== 'coach') throw new Error('Invalid role');
    if (!data.answers || typeof data.answers !== 'object') throw new Error('Answers are required');
    const expected = data.role === 'client' ? [...QUESTION_IDS.slice(0, 16), ...QUESTION_IDS.slice(26)] : [...QUESTION_IDS.slice(0, 6), ...QUESTION_IDS.slice(16)];
    expected.forEach(id => { if (!data.answers[id] || (Array.isArray(data.answers[id]) && !data.answers[id].length)) throw new Error(`Missing ${id}`); });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      Object.values(SHEETS).forEach(name => prepareSheet_(ss, name));
      const row = [data.responseId, new Date().toISOString(), data.role, ...QUESTION_IDS.map(id => clean_(data.answers[id]))];
      ss.getSheetByName(SHEETS.all).appendRow(row);
      ss.getSheetByName(data.role === 'client' ? SHEETS.client : SHEETS.coach).appendRow(row);
    } finally { lock.releaseLock(); }
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Invalid submission' });
  }
}

function prepareSheet_(ss, name) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#2b0d15').setFontColor('#ffffff');
    sheet.autoResizeColumns(1, HEADERS.length);
  }
}

function clean_(value) {
  if (value === undefined || value === null) return '';
  const output = Array.isArray(value) ? value.join(' | ') : String(value);
  // Prevent spreadsheet formula injection while retaining respondents' text.
  return /^[=+\-@]/.test(output) ? `'${output}` : output.slice(0, 5000);
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
