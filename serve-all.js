const http = require('http');
const fs = require('fs');
const path = require('path');

const services = {
    3002: 'community-service',
    3003: 'education-service',
    3004: 'inventory-service'
};

Object.keys(services).forEach(port => {
    http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        let url = req.url.split('?')[0];
        // Remove /app-bundle prefix
        if (url.startsWith('/app-bundle/')) {
            url = url.replace('/app-bundle/', '/');
        }
        
        let filePath = path.join(__dirname, services[port], 'public', url);
        
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            let ext = path.extname(filePath);
            let contentType = 'text/plain';
            if (ext === '.js') contentType = 'application/javascript';
            if (ext === '.css') contentType = 'text/css';
            if (ext === '.html') contentType = 'text/html';
            res.setHeader('Content-Type', contentType);
            res.writeHead(200);
            res.end(fs.readFileSync(filePath));
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    }).listen(port, () => console.log(`Serving ${services[port]} on port ${port}`));
});

// Also serve main-shell on 8080
http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    if (url === '/') url = '/index.html';
    let filePath = path.join(__dirname, 'main-shell', url);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        let ext = path.extname(filePath);
        let contentType = 'text/plain';
        if (ext === '.js') contentType = 'application/javascript';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.html') contentType = 'text/html';
        res.setHeader('Content-Type', contentType);
        res.writeHead(200);
        res.end(fs.readFileSync(filePath));
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
}).listen(8080, () => console.log('Serving main-shell on port 8080'));
