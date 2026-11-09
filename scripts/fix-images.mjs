import https from 'https';
import fs from 'fs';
import path from 'path';

// Fix the sports category image that had a bad URL
const fixImages = {
  'public/images/categories/sports.jpg': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop&q=80', // Soccer ball stadium
};

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, filePath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  for (const [filePath, url] of Object.entries(fixImages)) {
    try {
      console.log(`Downloading: ${filePath}`);
      await downloadFile(url, filePath);
      console.log(`  ✓ Done`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }
}
main();
