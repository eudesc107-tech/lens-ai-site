const { google } = require('googleapis');

const SHEET_NAME = 'Leads';
const RANGE = `${SHEET_NAME}!A2:G`;

function getAuth() {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
  const privateKey = Buffer.from(rawKey, 'base64').toString('utf8');

  return new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

async function getSheetsClient() {
  const auth = getAuth();
  await auth.authorize();
  return google.sheets({ version: 'v4', auth });
}

/**
 * Adiciona uma nova linha de lead na planilha.
 */
async function salvarLead({ nome, email, clinica, cargo, telefone, volume }) {
  const sheets = await getSheetsClient();
  const agora = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: RANGE,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[nome, email, clinica, cargo, telefone, volume, agora]],
    },
  });
}

module.exports = { salvarLead };
