const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//file
const LoginRoute = require("./src/routes/LoginRoute");
const MessageRoute = require("./src/routes/MessageRoute");
const LoginModel = require("./src/models/LoginModel");
const { Console } = require("console");
const MessageModel = require("./src/models/MessageModel");

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

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

socketIO.on("connection", (socket) => {
  socket.emit("me", socket.id);

  // Add a user to the online users list
  socket.on("addUser", async (userId) => {
    const userDetail = await LoginModel.findOne({ _id: userId });
    const newUser = { ...userDetail._doc, socketId: socket.id };

    const existingUser = onlineUsers.find(
      (user) => user?.email === newUser.email
    );
    if (existingUser) {
      return;
    }

    onlineUsers.push(newUser);
    socketIO.emit("getUsers", onlineUsers);
  });

  // Send person-to-person message
  socket.on("sendMessage", async ({ receiverEmail, text, senderId }) => {
    try {
      const recipientUser = onlineUsers.find(
        (user) => user?.email === receiverEmail
      );

      const bodyData = {
        receiverId: recipientUser?._id,
        text: text,
        senderId: senderId,
      };
      const newMessage = new MessageModel(bodyData);
      await newMessage.save();
      console.log(recipientUser, "recipientUser?.socketId");
      console.log(socket.id, "socket.id");

      socketIO.to(recipientUser?.socketId).emit("getMessage", {
        text,
        senderId,
        receiverId: recipientUser?._id,
      });
    } catch (err) {
      console.log(err);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    socketIO.emit("getUsers", onlineUsers);
  });
});

app.use("/api/auth", LoginRoute);
app.use("/api/message", MessageRoute);

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
