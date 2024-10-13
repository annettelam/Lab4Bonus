// The solution presented here was generated with the assistance of ChatGPT-3.5
// (https://chat.openai.com/), an AI model by OpenAI, to help implement and optimize this code.

const http = require("http");
const url = require("url");

const hostname = "0.0.0.0"; // Listen on all available interfaces
const port = 3002; // You can choose any available port

// In-memory dictionary
const dictionary = [];
let requestCount = 0;

// Helper function to parse JSON body
const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    });
  });
};

// Helper function to validate input
const isValidString = (str) => {
  return (
    typeof str === "string" &&
    str.trim().length > 0 &&
    /^[A-Za-z\s]+$/.test(str)
  );
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Enable CORS (Modify the origin as per your Server1 domain)
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace '*' with specific origin for better security
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === "/api/definitions" && req.method === "GET") {
    requestCount++;
    const word = query.word;

    if (!isValidString(word)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid word parameter." }));
      return;
    }

    const entry = dictionary.find(
      (item) => item.word.toLowerCase() === word.toLowerCase()
    );

    if (entry) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          requestNumber: requestCount,
          word: entry.word,
          definition: entry.definition,
        })
      );
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          requestNumber: requestCount,
          message: `Word '${word}' not found!`,
        })
      );
    }
  } else if (pathname === "/api/definitions" && req.method === "POST") {
    requestCount++;
    try {
      const body = await parseRequestBody(req);
      const word = body.word;
      const definition = body.definition;

      if (!isValidString(word) || !isValidString(definition)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message:
              "Invalid input. Both word and definition must be non-empty strings containing only letters and spaces.",
          })
        );
        return;
      }

      const existing = dictionary.find(
        (item) => item.word.toLowerCase() === word.toLowerCase()
      );

      if (existing) {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            requestNumber: requestCount,
            message: `Warning! The word '${word}' already exists.`,
          })
        );
      } else {
        dictionary.push({ word, definition });
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            requestNumber: requestCount,
            totalEntries: dictionary.length,
            message: `New entry recorded:\n"${word} : ${definition}"`,
          })
        );
      }
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON format." }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Endpoint not found." }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
