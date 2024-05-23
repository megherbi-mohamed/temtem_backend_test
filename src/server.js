// Init modules
require("./loader");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const port = process.env.PORT || 3002;
const app = express();

// Serve static files from the 'public' folder
app.use("/uploads", express.static("uploads"));

// use helmet middleware
app.use(helmet());

// Define the list of allowed origins
const allowedOrigins = [];

// use cors middleware
app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use(require("@utils/swagger"));

// Routing
app.use(require("@routes/route"));

var server = app.listen(port, () => {
  console.info(`App listening at http://localhost:${port}`);
});

// PM2 Graceful Shutdown
function closeServer() {
  // Stops the server from accepting new connections and finishes existing connections.
  server.close(function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
process.on("SIGINT", () => {
  console.info("SIGINT signal received.");
  closeServer();
});
