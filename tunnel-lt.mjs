import localtunnel from 'localtunnel';
import fs from 'fs';

(async () => {
  try {
    console.log('Connecting localtunnel to port 5173...');
    const tunnel = await localtunnel({ port: 5173 });
    console.log('==============================================');
    console.log('PUBLIC TEMPORARY LINK: ' + tunnel.url);
    console.log('==============================================');
    fs.writeFileSync('public-url.txt', tunnel.url);
    
    tunnel.on('close', () => {
      console.log('localtunnel closed');
    });
    tunnel.on('error', (err) => {
      console.error('localtunnel error:', err);
    });
  } catch (err) {
    console.error('Failed to create localtunnel:', err);
  }
})();
