require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const dbstring = process.env.DATABASE_URL;

mongoose.connect(dbstring);
const db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});

db.once("connected", () => {
  console.log("Database Connected...");
});

const routes = require("./routes/routes");
const app = express();

app.use(express.json());
app.use("/Twitter_Clone", routes);

app.listen(3000, () => {
  console.log(`server started at localhost ${3000}`);
});
