const express = require("express");
const router = express.Router();

const { getDB } = require("../db");


// ADD OPERATION NOTE
router.post("/", async (req, res) => {
  const db = getDB();

  const note = req.body;

  const result = await db
    .collection("operationNotes")
    .insertOne(note);

  res.send(result);
});


// GET ALL NOTES
router.get("/", async (req, res) => {
  const db = getDB();

  const notes = await db
    .collection("operationNotes")
    .find()
    .toArray();

  res.send(notes);
});

module.exports = router;