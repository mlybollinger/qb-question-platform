const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.PROXY_URL,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log('→ Proxying:', req.method, req.url);
          console.log('→ Target host:', proxyReq.host);
          console.log('→ Target path:', proxyReq.path);
        },
        error: (err, req, res) => {
          console.error('Proxy error:', err.message);
        }
      }
      logger: console
    })
  );
};
