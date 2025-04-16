/**
 * Servidor HTTP simples para o Relatório Amica
 * 
 * Este script cria um servidor HTTP básico para servir o relatório Amica localmente.
 * Ele é uma alternativa para quem prefere usar Node.js em vez de Python ou PHP.
 * 
 * Para usar:
 * 1. Certifique-se de ter o Node.js instalado
 * 2. Execute este script com: node server.js
 * 3. Acesse http://localhost:8000 no seu navegador
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configurações do servidor
const PORT = process.env.PORT || 8000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

// Criar servidor HTTP
const server = http.createServer((req, res) => {
  console.log(`Requisição: ${req.method} ${req.url}`);
  
  // Normalizar a URL
  let url = req.url;
  
  // Redirecionar para index.html se for a raiz
  if (url === '/') {
    url = '/index.html';
  }
  
  // Construir o caminho do arquivo
  const filePath = path.join(__dirname, url);
  
  // Verificar a extensão do arquivo
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  // Ler e servir o arquivo
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Arquivo não encontrado
        console.error(`Arquivo não encontrado: ${filePath}`);
        res.writeHead(404);
        res.end('Arquivo não encontrado');
      } else {
        // Outro erro de servidor
        console.error(`Erro ao servir arquivo: ${err.code}`);
        res.writeHead(500);
        res.end(`Erro do servidor: ${err.code}`);
      }
    } else {
      // Arquivo encontrado e servido com sucesso
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`
==================================================
  Servidor do Relatório Amica iniciado!
  
  Acesse: http://localhost:${PORT}
  
  Para encerrar, pressione Ctrl+C
==================================================
  `);
}); 