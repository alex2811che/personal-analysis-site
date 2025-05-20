// pages/api/analysis.js
// Обязательно ставим Node.js (fs работает только в нём)
export const config = { runtime: 'nodejs' };

import fs from 'fs';
import path from 'path';

// куда сохранять отчёты
const filePath = path.join(process.cwd(), 'data', 'reports.json');

export default function handler(req, res) {
  // POST — принимаем JSON автоматически в req.body
  if (req.method === 'POST') {
    const { date, html } = req.body || {};
    if (!date || !html) {
      return res.status(400).json({ error: 'Missing date or html' });
    }
    // читаем существующие
    let arr = [];
    try {
      arr = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {}
    // добавляем и сохраняем
    arr.unshift({ date, html });
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(arr, null, 2), 'utf8');
    return res.status(200).json({ success: true });
  }

  // GET — возвращаем все отчёты
  if (req.method === 'GET') {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      return res.status(200).json(JSON.parse(raw));
    } catch {
      return res.status(200).json([]);
    }
  }

  // всё остальное — 405
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
