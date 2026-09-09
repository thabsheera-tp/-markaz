import { startTunnel } from 'untun';
import fs from 'fs';

async function main() {
  try {
    console.log('Starting Cloudflare Tunnel via untun for port 5173...');
    const tunnel = await startTunnel({ port: 3000 });
    const url = await tunnel.getURL();
    console.log('==============================================');
    console.log('PUBLIC TEMPORARY LINK: ' + url);
    console.log('==============================================');
    fs.writeFileSync('public-url.txt', url);
  } catch (err) {
    console.error('Error starting tunnel:', err);
  }
}

main();
