// pages/api/analysis.js
import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'reports.json');

export default function handler(req, res) {
  // POST — добавляем новый отчёт
  if (req.method === 'POST') {
    const { date, html } = req.body;               // Здесь Next.js сам разобрал JSON
    if (!date || !html) {
      return res.status(400).json({ error: 'Missing date or html' });
    }

    // читаем существующие отчёты
    let reports = [];
    try {
      reports = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch {
      // файла ещё нет — оставляем пустой массив
      reports = [];
    }

    // добавляем новый
    reports.push({ date, html });

    // сохраняем (создадим папку data, если её нет)
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(reports, null, 2), 'utf8');

    return res.status(200).json({ success: true });
  }

  // GET — возвращаем все отчёты
  if (req.method === 'GET') {
    try {
      const content = fs.readFileSync(dataFile, 'utf8');
      return res.status(200).json(JSON.parse(content));
    } catch {
      return res.status(200).json([]);
    }
  }

  // все остальные методы — 405
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
