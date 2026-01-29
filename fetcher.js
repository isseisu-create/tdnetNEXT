// fetcher.js
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import fs from 'fs';

async function fetchTDnet() {
  const url = 'https://www.release.tdnet.info/inbs/I_main_00.html';
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  
  const rows = dom.window.document.querySelectorAll('#main-list-table tr');
  const disclosures = Array.from(rows).map(row => {
    const cols = row.querySelectorAll('td');
    if (cols.length < 5) return null;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      time: cols[0].textContent.trim(),
      code: cols[1].textContent.trim(),
      companyName: cols[2].textContent.trim(),
      title: cols[3].textContent.trim(),
      pdfUrl: 'https://www.release.tdnet.info/inbs/' + cols[3].querySelector('a')?.href,
      fullDate: new Date().toISOString().split('T')[0]
    };
  }).filter(item => item !== null);

  fs.writeFileSync('./data.json', JSON.stringify(disclosures, null, 2));
  console.log(`Success: ${disclosures.length} items fetched.`);
}

fetchTDnet();
