const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONNECT_STRING);
mongoose.connection.on("connected", () => console.info(`Database connected`));

mongoose.connection.on("error", (err) =>
  console.error(`Database error => ${err}`)
);
