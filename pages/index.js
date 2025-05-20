// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch('/api/analysis')
      .then(res => res.json())
      .then(data => setReports(data));
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Daily ES Analysis</h1>
      {reports.length === 0
        ? <p>No reports yet.</p>
        : reports.map((r, i) => (
            <section key={i} style={{ marginBottom: '2rem' }}>
              <h2>{r.date}</h2>
              <div dangerouslySetInnerHTML={{ __html: r.html }} />
            </section>
          ))}
    </main>
);
}
