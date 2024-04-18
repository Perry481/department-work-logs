const http = require("http");
const { parse } = require("url");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3005;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      const parsedUrl = parse(req.url, true);

      // Get current date and time
      const now = new Date();

      // Format date and time
      const timestamp = now.toLocaleString(); // Adjust format as needed

      // Conditional logging based on URL and method
      if (
        (req.url === "/" && req.method === "GET") ||
        (req.url === "/api/updateDB" && req.method === "POST") ||
        (req.url === "/api/deleteDB" && req.method === "DELETE")
      ) {
        console.log(
          `[${timestamp}] Received ${req.method} request from ${req.connection.remoteAddress} for ${req.url}`
        );
      }

      handle(req, res, parsedUrl);
    })
    .listen(port, "0.0.0.0", (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
});
