// proxy.js
const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing url parameter');
    return;
  }

  https.get(targetUrl, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  }).on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Error: ${err.message}`);
  });
});

server.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
