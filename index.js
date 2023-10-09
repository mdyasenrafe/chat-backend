const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//file
const LoginRoute = require("./src/routes/LoginRoute");

require("dotenv").config();

const port = process.env.PORT || 8080;

// file call
const app = express();

const http = require("http").Server(app);

// middle wares
app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: "200mb" }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// model connect
mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5iwe9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Mongodb connected....");
  })
  .catch((err) => console.log(err.message));

app.use("/api/login", LoginRoute);

// cors erorr
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => {
  res.send("This is People Connect Server");
});

app.use((req, res, next) => {
  res
    .status(404)
    .json({ status: 404, error: true, message: "Not Found this route" });
});

//   test
http.listen(port, () => {
  console.log("sucessfully run by", port);
  ``;
});
