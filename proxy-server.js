const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// CORS 설정
app.use(
  cors({
    origin: ['http://localhost:8080', 'http://localhost:8081', 'http://192.168.45.19:8081'],
    credentials: true,
  })
);

// 프록시 설정
app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://speako.site',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api',
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log('프록시 요청:', req.method, req.url);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('프록시 응답:', proxyRes.statusCode);
    },
  })
);

app.listen(PORT, () => {
  console.log(`프록시 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
