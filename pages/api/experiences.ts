import { google } from 'googleapis'
import type { NextApiRequest, NextApiResponse } from 'next'

const SHEET_ID = process.env.SHEET_ID!
const SHEET_RANGE = process.env.SHEET_RANGE || 'experiences!A1:AG'

// NEW: auth por JSON completo (evita problemas de PEM)
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
    if (!rows.length) return res.status(200).json({ count: 0, items: [] })

    const [headers, ...records] = rows

    const toBool = (v: any) => {
      if (v === true || v === false) return v
      if (typeof v === 'string') return ['true','1','yes','si','sí'].includes(v.toLowerCase())
      if (typeof v === 'number') return !!v
      return null
    }

    const toNum = (v: any) => {
      const n = Number(v)
      return Number.isFinite(n) ? n : null
    }

    const splitList = (v: any) => {
      if (!v || typeof v !== 'string') return []
      // split by ; or |
      return v.split(/;|\|/).map((s: string) => s.trim()).filter(Boolean)
    }

    const items = records.map((row) => {
      const obj: any = {}
      headers.forEach((h: string, i: number) => { obj[h] = row[i] })
      obj.id = String(obj.id || '').trim()
      obj.title = String(obj.title || '').trim()
      obj.isActive = toBool(obj.isActive)
      obj.refundable = toBool(obj.refundable)
      obj.priceAdultARS = toNum(obj.priceAdultARS)
      obj.priceChildARS = toNum(obj.priceChildARS)
      obj.childAgeMin = toNum(obj.childAgeMin)
      obj.childAgeMax = toNum(obj.childAgeMax)
      obj.durationHours = toNum(obj.durationHours)
      obj.daysCount = toNum(obj.daysCount)
      obj.minPax = toNum(obj.minPax)
      obj.maxPax = toNum(obj.maxPax)
      obj.includes = splitList(obj.includes)
      obj.notIncludes = splitList(obj.notIncludes)
      obj.highlights = splitList(obj.highlights)
      obj.images = splitList(obj.images)
      obj.language = splitList(obj.language)
      // optional checkoutUrl if present in sheet
      if (obj.checkoutUrl) obj.checkoutUrl = String(obj.checkoutUrl)
      return obj as Experience
    }).filter((it: any) => it.id && it.title && it.isActive !== false)

    cache = { ts: Date.now(), items }
    res.status(200).json({ count: items.length, items, cached: false })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: 'SHEETS_READ_ERROR', message: err?.message || 'Unknown error' })
  }
}

export const config = { api: { bodyParser: false } }
