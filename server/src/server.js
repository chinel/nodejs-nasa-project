const http = require("http");
require("dotenv").config();
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const MONGO_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@nasacluster.br0m6yy.mongodb.net/?retryWrites=true&w=majority`;

const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}...`);
  });
}

startServer();
