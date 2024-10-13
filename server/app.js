// server/app.js
const http = require('http');
const url = require('url');

const dictionary = []; // Array to store word definitions
let requestCount = 0;  // Counter for the number of requests

// Import user-facing strings
const messages = require('./messages');

const server = http.createServer((req, res) => {
    requestCount++;
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;

    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://lab4-client.netlify.app/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (method === 'GET' && pathname === '/api/definitions/') {
        // Handle GET request
        handleGetRequest(req, res, parsedUrl);
    } else if (method === 'POST' && pathname === '/api/definitions') {
        // Handle POST request
        handlePostRequest(req, res);
    } else {
        // Handle invalid routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: messages.notFound }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

function handleGetRequest(req, res, parsedUrl) {
    const word = parsedUrl.query.word;

    if (!word || /\d/.test(word)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: messages.invalidWordInput }));
        return;
    }

    const entry = dictionary.find(item => item.word.toLowerCase() === word.toLowerCase());

    if (entry) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            requestCount,
            entry
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            requestCount,
            message: `Request #${requestCount}, word '${word}' not found!`
        }));
    }
}

function handlePostRequest(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const { word, definition } = JSON.parse(body);

            // Input validation
            if (!word || !definition || /\d/.test(word)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: messages.invalidInput }));
                return;
            }

            const exists = dictionary.some(item => item.word.toLowerCase() === word.toLowerCase());

            if (exists) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: `Warning! '${word}' already exists.`,
                    requestCount,
                    totalEntries: dictionary.length
                }));
            } else {
                dictionary.push({ word, definition });
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'New entry recorded:',
                    entry: { word, definition },
                    requestCount,
                    totalEntries: dictionary.length
                }));
            }
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: messages.invalidJSON }));
        }
    });
}
