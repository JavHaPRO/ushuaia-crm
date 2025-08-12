import { google } from 'googleapis'
import type { NextApiRequest, NextApiResponse } from 'next'

const SHEET_ID = process.env.SHEET_ID!
const SHEET_RANGE = process.env.SHEET_RANGE || 'experiences!A1:AG'

function getSheetsClient() {
  const pa = process.env.GOOGLE_SA_JSON
  if (!pa) throw new Error('GOOGLE_SA_JSON missing')
  const credentials = JSON.parse(pa)
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
  })
  const sheets = google.sheets({ version: 'v4', auth })
  return sheets
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sheets = getSheetsClient()
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING',
    })
    const rows = data.values || []
    const headers = rows[0] || []
    const items = rows.slice(1).map(row => {
      let obj: any = {}
      headers.forEach((h, i) => {
        obj[h] = row[i]
      })
      return obj
    }).filter(item => String(item.isActive).toLowerCase() === 'true')

    res.status(200).json({ count: items.length, items })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: 'SHEETS_READ_ERROR', message: err.message })
  }
}
