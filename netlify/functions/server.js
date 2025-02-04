const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let words = []; // In-memory storage

// Get all words
app.get("/api/words", (req, res) => {
  res.json(words);
});

// Add a word
app.post("/api/words", (req, res) => {
  const { word, clue } = req.body;
  if (!word || !clue) {
    return res.status(400).json({ message: "Word and clue are required" });
  }
  const newWord = { word, clue };
  words.push(newWord);
  res.json({ id: words.length - 1, ...newWord });
});

// Update a word
app.put("/api/words/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { word, clue } = req.body;
  if (id < 0 || id >= words.length) {
    return res.status(404).json({ message: "Word not found" });
  }
  words[id] = { word, clue };
  res.json({ id, ...words[id] });
});

// Delete a word
app.delete("/api/words/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id < 0 || id >= words.length) {
    return res.status(404).json({ message: "Word not found" });
  }
  words.splice(id, 1);
  res.json({ message: "Word deleted" });
});

// Export handler for Netlify
module.exports.handler = serverless(app);
