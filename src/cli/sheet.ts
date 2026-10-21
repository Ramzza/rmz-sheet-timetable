import { google } from "googleapis";
import { Timetable, findMerges } from "../core";

/**
 * Uploads a timetable to the first tab of a Google Sheet, merging equal
 * adjacent cells. Auth uses Application Default Credentials
 * (e.g. GOOGLE_APPLICATION_CREDENTIALS of a service account with edit access).
 * @param sheetId Google spreadsheet id.
 * @param timetable Timetable to upload.
 */
export async function uploadToSheet(sheetId: string, timetable: Timetable): Promise<void> {
  const auth = new google.auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const sheets = google.sheets({ version: "v4", auth });
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const first = meta.data.sheets?.[0]?.properties;
  if (first?.sheetId == null || !first.title) throw new Error("Spreadsheet has no sheets");
  const range = { sheetId: first.sheetId };
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: { requests: [{ unmergeCells: { range } }, { updateCells: { range, fields: "userEnteredValue" } }] },
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `'${first.title.replace(/'/g, "''")}'!A1`,
    valueInputOption: "RAW",
    requestBody: { values: timetable.grid },
  });
  const requests = findMerges(timetable.grid).map((m) => ({
    mergeCells: {
      range: { ...range, startRowIndex: m.startRow, endRowIndex: m.endRow, startColumnIndex: m.column, endColumnIndex: m.column + 1 },
      mergeType: "MERGE_ALL",
    },
  }));
  if (requests.length) await sheets.spreadsheets.batchUpdate({ spreadsheetId: sheetId, requestBody: { requests } });
}
