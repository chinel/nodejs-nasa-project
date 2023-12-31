const mongoose = require("mongoose");
// const DB_USER = process.env.DB_USER;
// const DB_PASSWORD = process.env.DB_PASSWORD;
// const DB_NAME = process.env.DB_NAME;

const MONGO_URL = process.env.MONGO_URL;

// we can also use once() here instead of on() since our
//database connection will open only once. Once is and
// event emitter used when it will something will occur only once
mongoose.connection.on("open", () => {
  console.log("Mongo Connection Ready!!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true, // this determines how monoogse parses the connection string (MONGO_URL)
    useUnifiedTopology: true, // this way mongoose will use the updated way of talking to clusters of mongo databases
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
