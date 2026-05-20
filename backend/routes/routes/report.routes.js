const express = require("express");
const router = express.Router();

const { getDB } = require("../db");

router.get("/doctor-company", async (req, res) => {
  const db = getDB();

  const data = await db.collection("prescriptions").aggregate([
    { $unwind: "$medicines" },
    {
      $group: {
        _id: {
          doctor: "$doctor",
          medicine: "$medicines.name"
        },
        count: { $sum: 1 }
      }
    }
  ]).toArray();

  res.send(data);
});

router.get("/medicine-usage", async (req, res) => {
  const db = getDB();

  const data = await db.collection("prescriptions").aggregate([
    { $unwind: "$medicines" },
    {
      $group: {
        _id: "$medicines.name",
        count: { $sum: 1 }
      }
    }
  ]).toArray();

  res.send(data);
});

router.get("/company-usage", async (req, res) => {
  const db = getDB();

  const data = await db.collection("prescriptions").aggregate([
    { $unwind: "$medicines" },
    {
      $group: {
        _id: "$medicines.company",
        count: { $sum: 1 }
      }
    }
  ]).toArray();

  res.send(data);
});