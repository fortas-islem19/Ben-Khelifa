/**
 * Pâtisserie Benkhelifa — order receiver (Google Apps Script).
 * Paste this file into Extensions → Apps Script of your orders spreadsheet,
 * then deploy it as a Web App (see README.md in this folder).
 */

var SHEET_NAME = 'Commandes';
var DRIVE_FOLDER_NAME = 'Benkhelifa — Photos commandes';

/** Column order in the sheet: [payload key, column header]. Add columns at the end. */
var COLUMNS = [
  ['reference', 'Référence'],
  ['createdAt', 'Reçue le'],
  ['status', 'Statut'],
  ['customerName', 'Client'],
  ['phone', 'Téléphone'],
  ['email', 'E-mail'],
  ['model', 'Modèle'],
  ['occasion', 'Occasion'],
  ['size', 'Taille'],
  ['shape', 'Forme'],
  ['sponge', 'Génoise'],
  ['filling', 'Garniture'],
  ['finish', 'Finition'],
  ['colors', 'Couleurs'],
  ['decorations', 'Décorations'],
  ['nameOnCake', 'Prénom sur gâteau'],
  ['age', 'Âge'],
  ['message', 'Message'],
  ['designNotes', 'Description / modifications'],
  ['referenceImageUrl', 'Photo d’inspiration'],
  ['date', 'Date souhaitée'],
  ['timeSlot', 'Créneau'],
  ['fulfillment', 'Retrait'],
  ['address', 'Adresse'],
  ['city', 'Ville'],
  ['estimatedPrice', 'Prix estimé'],
  ['currency', 'Devise'],
  ['referral', 'Source'],
  ['notes', 'Remarques'],
  ['pageUrl', 'Page'],
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    if (data.referenceImage && data.referenceImage.data) {
      data.referenceImageUrl = saveImage_(data.referenceImage, data.reference);
    }

    var row = COLUMNS.map(function (col) {
      var value = data[col[0]];
      if (col[0] === 'createdAt' && value) return new Date(value);
      return value === undefined || value === null ? '' : value;
    });
    sheet.appendRow(row);

    // Optional: email notification for each new order
    // MailApp.sendEmail('vous@exemple.com', 'Nouvelle commande ' + data.reference, data.customerName + ' — ' + data.model);

    return json_({ ok: true, reference: data.reference });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Opening the Web App URL in a browser should display {"ok":true}. */
function doGet() {
  return json_({ ok: true, service: 'benkhelifa-orders' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(function (c) { return c[1]; }));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#d9bd7e');
  }
  return sheet;
}

function saveImage_(image, reference) {
  var folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(DRIVE_FOLDER_NAME);
  var blob = Utilities.newBlob(Utilities.base64Decode(image.data), image.mimeType || 'image/jpeg', reference + ' - ' + (image.name || 'photo.jpg'));
  var file = folder.createFile(blob);
  return file.getUrl();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
