// Download REAL game cover art from Steam's public CDN
// Steam library capsule images: 600x900 portrait format (perfect for game cards)
// Format: https://cdn.akamai.steamstatic.com/steam/apps/{APPID}/library_600x900_2x.jpg
// Header capsule (landscape): https://cdn.akamai.steamstatic.com/steam/apps/{APPID}/header.jpg

import https from 'https';
import fs from 'fs';
import path from 'path';

// Steam App IDs for each game
const gameCovers = {
  // Trending Games
  'public/games/gta-v.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/library_600x900_2x.jpg',
  'public/games/rdr2.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/library_600x900_2x.jpg',
  'public/games/elden-ring.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_600x900_2x.jpg',
  'public/games/gow.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/2322010/library_600x900_2x.jpg', // God of War Ragnarök
  'public/games/forza.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/library_600x900_2x.jpg',
  'public/games/tlou.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1888930/library_600x900_2x.jpg',
  
  // Deal Games
  'public/games/witcher3.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/292030/library_600x900_2x.jpg',
  'public/games/hogwarts.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/990080/library_600x900_2x.jpg',
  'public/games/acv.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/2208920/library_600x900_2x.jpg', // AC Valhalla
  'public/games/cyberpunk.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/library_600x900_2x.jpg',
  'public/games/spiderman.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/library_600x900_2x.jpg', // Spider-Man Remastered
  
  // Pre-order / Upcoming Games
  'public/games/gta-vi.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/library_600x900_2x.jpg', // Use GTA V as placeholder for VI
  'public/games/ac-shadows.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/3035710/library_600x900_2x.jpg',
  'public/games/mh-wilds.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/2246340/library_600x900_2x.jpg',
  'public/games/doom.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/3017860/library_600x900_2x.jpg',
};

// Category header images (landscape format from Steam)
const categoryImages = {
  'public/games/categories/action.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg', // RDR2 for Action
  'public/games/categories/adventure.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1888930/header.jpg', // TLOU for Adventure
  'public/games/categories/racing.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg', // Forza for Racing
  'public/games/categories/rpg.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg', // Elden Ring for RPG
  'public/games/categories/shooter.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg', // Cyberpunk for Shooter (has FPS elements)
  'public/games/categories/sports.jpg': 'https://cdn.akamai.steamstatic.com/steam/apps/1811260/header.jpg', // EA FC for Sports
};

const allImages = { ...gameCovers, ...categoryImages };

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const doDownload = (url, redirects = 0) => {
      if (redirects > 5) { reject(new Error('Too many redirects')); return; }
      
      https.get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          doDownload(response.headers.location, redirects + 1);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode} for ${url}`));
          return;
        }
        const file = fs.createWriteStream(filePath);
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
        file.on('error', reject);
      }).on('error', reject);
    };
    
    doDownload(url);
  });
}

async function main() {
  console.log('Downloading real game artwork from Steam CDN...\n');
  
  let success = 0;
  let failed = 0;
  const failures = [];
  
  for (const [filePath, url] of Object.entries(allImages)) {
    try {
      process.stdout.write(`  ${filePath} ... `);
      await downloadFile(url, filePath);
      const size = fs.statSync(filePath).size;
      console.log(`✓ (${(size/1024).toFixed(0)} KB)`);
      success++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
      failures.push({ filePath, url, error: err.message });
    }
  }
  
  console.log(`\n${success} downloaded, ${failed} failed.`);
  
  if (failures.length > 0) {
    console.log('\nFailed downloads (need manual replacement):');
    failures.forEach(f => console.log(`  - ${f.filePath}: ${f.error}`));
  }
}

main();
