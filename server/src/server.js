const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const MONGO_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@nasacluster.br0m6yy.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const server = http.createServer(app);

// we can also use once() here instead of on() since our
//database connection will open only once. Once is and
// event emitter used when it will something will occur only once
mongoose.connection.on("open", () => {
  console.log("Mongo Connection Ready!!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true, // this determines how monoogse parses the connection string (MONGO_URL)
    useUnifiedTopology: true, // this way mongoose will use the updated way of talking to clusters of mongo databases
  });
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}...`);
  });
}

startServer();
