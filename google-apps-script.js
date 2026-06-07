const SHEET_NAME = "Messages";

function doPost(event) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Email", "Message"]);
  }

  const data = event.parameter;
  sheet.appendRow([
    data.Timestamp || new Date().toISOString(),
    data.Name || "",
    data.Email || "",
    data.Message || ""
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
