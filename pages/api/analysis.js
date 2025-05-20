// pages/api/analysis.js
export const config = { runtime: 'nodejs' };      // важно: Node-runtime

import fs   from 'fs';
import path from 'path';

// сохраняем во временную папку лямбды
const filePath = path.join('/tmp', 'reports.json');

export default function handler(req, res) {
  // ---------- POST ----------
  if (req.method === 'POST') {
    const { date, html } = req.body || {};
    if (!date || !html) return res.status(400).json({ error: 'Missing date or html' });

    let arr = [];
    try { arr = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch {}

    arr.unshift({ date, html });                                 // добавляем новый отчёт
    fs.writeFileSync(filePath, JSON.stringify(arr, null, 2));    // пишем в /tmp

    return res.status(200).json({ success: true });
  }

  // ---------- GET ----------
  if (req.method === 'GET') {
    try { return res.status(200).json(JSON.parse(fs.readFileSync(filePath, 'utf8'))); }
    catch { return res.status(200).json([]); }                   // если файла нет — []
  }

  // ---------- всё остальное ----------
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
