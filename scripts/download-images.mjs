// Script to download high-quality gaming-themed images from Unsplash
// Run with: node scripts/download-images.mjs

import https from 'https';
import fs from 'fs';
import path from 'path';

const images = {
  // Deal game covers - using specific cinematic Unsplash photos
  'public/images/covers/acv.jpg': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=560&fit=crop&q=80', // Dramatic snowy mountains (Viking vibes)
  'public/images/covers/cyberpunk.jpg': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=560&fit=crop&q=80', // Neon city night (cyberpunk vibes)
  'public/images/covers/spiderman.jpg': 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=400&h=560&fit=crop&q=80', // City skyline at night

  // Pre-order covers
  'public/images/covers/gta-vi.jpg': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=560&fit=crop&q=80', // Miami-style tropical city
  'public/images/covers/ac-shadows.jpg': 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=560&fit=crop&q=80', // Japanese temple (assassin vibes)
  'public/images/covers/mh-wilds.jpg': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=560&fit=crop&q=80', // Dense forest/jungle
  'public/images/covers/doom.jpg': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=560&fit=crop&q=80', // Fiery dramatic sky

  // Categories - landscape format
  'public/images/categories/action.jpg': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&q=80', // Gaming/action
  'public/images/categories/adventure.jpg': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop&q=80', // Adventure landscape
  'public/images/categories/racing.jpg': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop&q=80', // Sports car
  'public/images/categories/rpg.jpg': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop&q=80', // Fantasy landscape
  'public/images/categories/shooter.jpg': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&q=80', // Gaming
  'public/images/categories/sports.jpg': 'https://images.unsplash.com/photo-1461896836934-ber2a3057c23?w=600&h=400&fit=crop&q=80', // Stadium

  // Avatars  
  'public/images/avatars/avatar1.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
  'public/images/avatars/avatar2.jpg': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
  'public/images/avatars/avatar3.jpg': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80',
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
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const [filePath, url] of Object.entries(images)) {
    try {
      console.log(`Downloading: ${filePath}`);
      await downloadFile(url, filePath);
      console.log(`  ✓ Done`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }
  console.log('\nAll downloads complete!');
}

main();
