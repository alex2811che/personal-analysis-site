// pages/api/analysis.js
export const config = { runtime: 'nodejs' };

import fs from 'fs';
import path from 'path';

// Путь к файлу data/reports.json
const filePath = path.join(process.cwd(), 'data', 'reports.json');

export default function handler(req, res) {
  // 1) GET — отдать все отчёты
  if (req.method === 'GET') {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const arr = JSON.parse(raw);
      return res.status(200).json(arr);
    } catch {
      return res.status(200).json([]);
    }
  }

  // 2) POST — добавить новый отчёт
  if (req.method === 'POST') {
    const { date, html } = req.body || {};
    if (!date || !html) {
      return res.status(400).json({ error: 'Missing date or html' });
    }

    let arr;
    try {
      arr = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      arr = [];
    }

    arr.unshift({ date, html });
    fs.writeFileSync(filePath, JSON.stringify(arr, null, 2), 'utf8');
    return res.status(200).json({ success: true });
  }

  // Всё остальное — запрещено
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
