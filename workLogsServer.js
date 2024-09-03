const http = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const port = parseInt(process.env.PORT, 10) || 3002;
const app = next({ dev: false });
const handle = app.getRequestHandler();

const logFile = "server.log"; // Log file path

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      const now = new Date();
      const timestamp = now.toLocaleString();

      if (
        (req.url === "/" && req.method === "GET") ||
        (req.url === "/api/updateDB" && req.method === "POST") ||
        (req.url === "/api/deleteDB" && req.method === "DELETE")
      ) {
        const logEntry = `[${timestamp}] Received ${req.method} request from ${req.connection.remoteAddress} for ${req.url}\n`;

        // Write to log file
        fs.appendFile(logFile, logEntry, (err) => {
          if (err) console.error("Error writing to log file:", err);
        });

        // Also log to console
        console.log(logEntry);
      }

      handle(req, res, parsedUrl);
    })
    .listen(port, "0.0.0.0", (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
});
