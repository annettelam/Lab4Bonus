const http = require('http');
const url = require('url');

// Initialize dictionary and request counter
const dictionary = [];
let requestCount = 0;

// CORS handling
const handleCors = (res) => {
    const allowedOrigins = ['https://lab4-client.netlify.app', 'http://localhost:5500', 'http://127.0.0.1:5500'];
    const origin = res.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;

    // Set CORS headers
    handleCors(res);

    // Handle preflight OPTIONS request
    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (method === 'GET' && pathname === '/') {
        handleGetRequest(req, res, parsedUrl);
    } else if (method === 'POST' && pathname === '/') {
        handlePostRequest(req, res);
    } else {
        // Handle invalid routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
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
        res.end(JSON.stringify({ message: 'Invalid word input (no numbers allowed).' }));
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
            message: `Word '${word}' not found!`
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

            if (!word || !definition || /\d/.test(word)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid input (please provide a valid word and definition).' }));
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
                    message: 'New entry recorded.',
                    entry: { word, definition },
                    requestCount,
                    totalEntries: dictionary.length
                }));
            }
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON input.' }));
        }
    });
}
