import localtunnel from 'localtunnel';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  console.log('Starting public tunnel for port 5173...');
  try {
    const tunnel = await localtunnel({ port: 5173 });
    const url = tunnel.url;
    console.log('====================================================');
    console.log(' KOYYAM MARKAZ PUBLIC PREVIEW URL:');
    console.log(' ' + url);
    console.log('====================================================');

    const outPath = path.resolve(__dirname, '../public-url.txt');
    fs.writeFileSync(outPath, url);

    tunnel.on('close', () => {
      console.log('Tunnel closed. Reconnecting...');
      start();
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });
  } catch (err) {
    console.error('Failed to create tunnel:', err);
    setTimeout(start, 3000);
  }
}

start();
