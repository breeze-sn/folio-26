const DEFAULT_SHEET_NAME = "Contact Responses";

function doGet() {
  return HtmlService.createHtmlOutput("Contact form endpoint is running.");
}

function doPost(e) {
  const sheet = getOrCreateSheet_();
  const params = (e && e.parameter) || {};

  const timestamp = new Date();
  const name = (params.name || "").trim();
  const email = (params.email || "").trim();
  const message = (params.message || "").trim();
  const source = (params.source || "portfolio-contact").trim();

  sheet.appendRow([timestamp, name, email, message, source]);

  return HtmlService.createHtmlOutput("Message saved successfully.");
}

function getOrCreateSheet_() {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty("SPREADSHEET_ID");
  const sheetName = props.getProperty("SHEET_NAME") || DEFAULT_SHEET_NAME;

  if (!spreadsheetId) {
    throw new Error("Missing script property SPREADSHEET_ID.");
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(["Timestamp", "Name", "Email", "Message", "Source"]);
  }

  return sheet;
}
