import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  const options = {
    root: path.join(__dirname),
  };

  const fileName = "index.html";
  res.sendFile(fileName, options, (err) => {
    if (err) {
      console.error("Error sending file:", err);
    }
  });
});

io.on("connection", (socket) => {
  let tempUsername;
  socket.on("login", (username) => {
    console.log(`Username: "${username}" has connected`);
    tempUsername = username;
  });

  socket.on("disconnect", () => {
    if (tempUsername)
      console.log(`Username: "${tempUsername}" has disconnected`);
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
