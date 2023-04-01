var express = require("express");
require("dotenv").config({ path: "./bin/.env" });
var app = express();

const existingIds = [];
const userIds = []

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
    if (userIds.includes(id)) {
      return generateRandomId();
    } else {
        userIds.push(id);
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
    console.log(userIds);
    res.send(id);
  } catch (error) {
    res.send(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running");
});
module.exports = app;
