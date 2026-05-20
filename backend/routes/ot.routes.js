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
router.get("/patient/:regNo", async (req, res) => {
const db = getDB();

const regNo = req.params.regNo;

const data = await db.collection("ot")
.find({ patientRegistrationNo: regNo })
.sort({ otDate: -1 }) // latest first
.toArray();

res.send(data);
});

module.exports = router;