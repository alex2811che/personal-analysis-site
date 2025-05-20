// pages/api/analysis.js
import fs from 'fs'
import path from 'path'

// жёсткий путь к data/reports.json в корне проекта
const filePath = path.join(process.cwd(), 'data', 'reports.json')

// Настройка Next.js — обязательно Node.js, чтобы мы могли юзать fs:
export const config = { runtime: 'nodejs' }

export default function handler(req, res) {
  // 1) GET — отдать все отчёты
  if (req.method === 'GET') {
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const arr = JSON.parse(raw)
      return res.status(200).json(arr)
    } catch {
      // если файла нет или JSON кривой — возвращаем пустой массив
      return res.status(200).json([])
    }
  }

  // 2) POST — добавить новый отчёт
  if (req.method === 'POST') {
    // Next.js сам распарсит JSON в req.body
    const { date, html } = req.body || {}
    if (!date || !html) {
      return res.status(400).json({ error: 'Missing date or html' })
    }

    let arr = []
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      arr = JSON.parse(raw)
    } catch {
      arr = []
    }

    // пушим в начало
    arr.unshift({ date, html })
    // сохраняем красиво отформатированным
    fs.writeFileSync(filePath, JSON.stringify(arr, null, 2), 'utf8')

    return res.status(200).json({ success: true })
  }

  // 3) всё остальное — запрещено
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
