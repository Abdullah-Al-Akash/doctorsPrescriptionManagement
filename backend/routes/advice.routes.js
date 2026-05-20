const express = require("express");
const router = express.Router();

const { getDB } = require("../db");


// ADD ADVICE
router.post("/", async (req, res) => {
  const db = getDB();

  const advice = req.body;

  const result = await db
    .collection("advice")
    .insertOne(advice);

  res.send(result);
});


// GET ALL ADVICE
router.get("/", async (req, res) => {
  const db = getDB();

  const data = await db
    .collection("advice")
    .find()
    .toArray();

  res.send(data);
});

module.exports = router;