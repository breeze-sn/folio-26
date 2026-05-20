function doGet() {
  return HtmlService.createHtmlOutput("Contact form endpoint is running.");
}

function doPost(e) {
  try {
    const params = getSubmissionData_(e);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName("Folio'26") || spreadsheet.getSheets()[1];

    if (!sheet) {
      throw new Error("Sheet 'Folio'26' was not found.");
    }

    const timestamp = new Date();
    const name = (params.name || "").trim();
    const email = (params.email || "").trim();
    const message = (params.message || "").trim();
    const source = (params.source || "portfolio-contact").trim();

    sheet.appendRow([timestamp, name, email, message, source]);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Data added successfully"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSubmissionData_(e) {
  if (!e) {
    throw new Error("doPost requires an event object. Test it by sending a request to the web app URL, not by running the function directly.");
  }

  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (error) {
      // Fall back to form fields if the request body is not JSON.
    }
  }

  return e.parameter || {};
}
