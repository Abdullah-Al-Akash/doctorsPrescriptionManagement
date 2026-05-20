const express = require("express");
const router = express.Router();

const { getDB } = require("../db");


// ADD OT
router.post("/", async (req, res) => {
  const db = getDB();

  const otData = req.body;

  const result = await db
    .collection("ot")
    .insertOne(otData);

  res.send(result);
});


// GET ALL OT
router.get("/", async (req, res) => {
  const db = getDB();

  const otList = await db
    .collection("ot")
    .find()
    .toArray();

  res.send(otList);
});

module.exports = router;