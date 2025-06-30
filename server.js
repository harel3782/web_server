const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = "./users.json";

// Load users or create empty file
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Register endpoint
app.post("/api/register", (req, res) => {
  const { email, username, password } = req.body;
  const users = loadUsers();

  if (users.find((u) => (u.username === username || u.email === email))) {
    return res.status(400).json({ message: "Username or email already exists" });
  }

  const newUser = { email, username, password }; // Note: plain text password, not secure
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: "User registered successfully" });
});

// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  res.json({ message: "Login successful", user });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
