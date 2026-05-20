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
    sendEmailNotification({ timestamp, name, email, message, source });

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

function sendEmailNotification({ timestamp, name, email, message, source }) {
  const recipient = "nagekarsimran@outlook.com";
  const subject = `New portfolio contact from ${name || "someone"}`;
  const plainTextBody = [
    `Name: ${name || "N/A"}`,
    `Email: ${email || "N/A"}`,
    `Message: ${message || "N/A"}`,
    `Source: ${source || "N/A"}`,
    `Timestamp: ${timestamp.toISOString()}`,
  ].join("\n");

  const htmlBody = `
    <p><strong>Name:</strong> ${escapeHtml_(name || "N/A")}</p>
    <p><strong>Email:</strong> ${escapeHtml_(email || "N/A")}</p>
    <p><strong>Message:</strong><br>${escapeHtml_(message || "N/A").replace(/\n/g, "<br>")}</p>
    <p><strong>Source:</strong> ${escapeHtml_(source || "N/A")}</p>
    <p><strong>Timestamp:</strong> ${escapeHtml_(timestamp.toISOString())}</p>
  `;

  MailApp.sendEmail({
    to: recipient,
    subject,
    body: plainTextBody,
    htmlBody,
  });
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
