// pages/api/analysis.js
import fs from 'fs';
import path from 'path';

// Путь к файлу с отчётами
const dataFile = path.join(process.cwd(), 'data', 'reports.json');

// Утилита для чтения JSON-тела POST-запроса
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(JSON.parse(body)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const content = fs.readFileSync(dataFile, 'utf8');
      return res.status(200).json(JSON.parse(content));
    } catch {
      return res.status(200).json([]);  // если файла нет, возвращаем пустой массив
    }
  }

  if (req.method === 'POST') {
    const { date, html } = await parseBody(req);
    let reports = [];
    try {
      reports = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch {
      // файл ещё не создан — оставляем reports = []
    }
    reports.unshift({ date, html });
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(reports, null, 2));
    return res.status(200).json({ success: true });
  }

  // остальные методы не поддерживаются
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
