// Dependencies
const express = require("express");
const fs = require("fs");
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const htmlPath = path.join(__dirname, "index.html");
const notesPath = path.join(__dirname, "notes.html");
const jsPath = path.join(__dirname, "assets/js/index.js");
const cssPath = path.join(__dirname, "assets/css/styles.css");

const jsonFile = ("db/db.json");

// Routes HTML pages
app.get("/", function (req, res) {
  res.sendFile(htmlPath);
});
app.get("/notes", function (req, res) {
  res.sendFile(notesPath);
});

//Local file routes
app.get("/assets/js/index.js", function (req, res) {
  res.sendFile(jsPath);
});

app.get("/assets/css/styles.css", function (req, res) {
  res.sendFile(cssPath);
});

//Read Notes
app.get("/api/notes", function (req, res) {
  let nodeTakerRead = JSON.parse(fs.readFileSync(jsonFile).toString());
  res.json(nodeTakerRead);
});

//Post notes
app.post("/api/notes", function (req, res) {
    let existingNotes = JSON.parse(fs.readFileSync(jsonFile));

    existingNotes.push({...req.body, id: Date.now()});

    fs.writeFileSync(jsonFile, JSON.stringify(existingNotes));
    res.send();
});

//Delete Note
app.delete("/api/notes/:id", function (req, res) {
  let updatedNotes = JSON.parse(fs.readFileSync(jsonFile)).filter(function (note) {
    return note.id !== parseInt(req.params.id);
  });
  fs.writeFileSync(jsonFile, JSON.stringify(updatedNotes));
  res.send();
});


app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
