const express = require("express");
const router = express.Router();

const { getDB } = require("../db");


// CREATE PRESCRIPTION
router.post("/", async (req, res) => {
  const db = getDB();

  const prescription = req.body;

  const result = await db
    .collection("prescriptions")
    .insertOne(prescription);

  res.send(result);
});


// GET ALL PRESCRIPTIONS
router.get("/", async (req, res) => {
  const db = getDB();

  const data = await db
    .collection("prescriptions")
    .find()
    .toArray();

  res.send(data);
});

// 🔥 NEW: history by patient
router.get("/patient/:regNo", async (req, res) => {
const db = getDB();

const regNo = req.params.regNo;

const data = await db.collection("prescriptions")
.find({ patientRegistrationNo: regNo })
.sort({ _id: -1 })
.toArray();

res.send(data);
});


module.exports = router;