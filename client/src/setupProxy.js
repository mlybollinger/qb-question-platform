const { createProxyMiddleware } = require('http-proxy-middleware');



module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.PROXY_URL,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req, res) => {
          res.setHeader('X-Proxy-Target', `${proxyReq.host}${proxyReq.path}`);
        },
        error: (err, req, res) => {
          console.error('Proxy error:', err.message);
        }
      },
      logger: console
    })
  );
  app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
  })
};
