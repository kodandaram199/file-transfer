var express = require("express");
require("dotenv").config({ path: "./bin/.env" });
var app = express();

const existingIds = [];
global.usersCodes = new Map();
function generateRandomId(user, ch, num) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";
  for (let i = 0; i < ch; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < num; i++) {
    id += Math.floor(Math.random() * 10);
  }
  if (user === 0) {
    if (existingIds.includes(id)) {
      return generateRandomId();
    } else {
      existingIds.push(id);
      return id;
    }
  } else {
    if (!global.usersCodes.get(id)) {
      return generateRandomId();
    } else {
      return id;
    }
  }
}

app.get("/receiver/generate-unique-id", (req, res) => {
  try {
    const id = generateRandomId(0, 2, 4);
    console.log(existingIds);
    res.send(id);
  } catch (error) {
    res.send(error);
  }
});
app.get("/user-id", (req, res) => {
  try {
    const id = generateRandomId(1, 10, 10);
    global.usersCodes.set(id, 1);
    console.log(userIds);
    res.send(id);
  } catch (error) {
    res.send(error);
  }
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("create-user-code", (userId) => {
    usersCodes.set(userId, socket.id);
  });

  socket.on('file-upload', (data) => {
    const { to, fileName, fileContent } = data;
    const sendUserSocket = onlineUsers.get(to);
    fs.writeFile(`uploads/${fileName}`, fileContent, (err) => {
      if (err) {
        console.error(err);
        socket.to(sendUserSocket).emit('file-upload-failed', err.message);
      } else {
        socket.to(sendUserSocket).emit('file-upload-success', { fileName });
        const file = path.join(__dirname, 'uploads', fileName);
        fs.readFile(file, (err, fileContent) => {
          if (err) {
            console.error(err);
            socket.to(sendUserSocket).emit('file-download-failed', err.message);
          } else {
            const fileData = { fileName, fileContent };
            socket.to(sendUserSocket).emit('file-uploaded', fileData);
          }
        });
      }
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running");
});
module.exports = app;
