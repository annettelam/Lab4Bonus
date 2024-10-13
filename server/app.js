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

  // Handle GET requests to /api/definitions
  if (pathname === "/api/definitions" && req.method === "GET") {
    requestCount++;
    const word = query.word;

    if (word) {
      // If a word is provided, search for the word definition
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
    } else {
      // If no word is provided, return all definitions
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          requestNumber: requestCount,
          totalEntries: dictionary.length,
          definitions: dictionary,
        })
      );
    }
  }
  // Handle POST requests to /api/definitions
  else if (pathname === "/api/definitions" && req.method === "POST") {
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
