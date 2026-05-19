const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/patients", require("./routes/patient.routes"));
app.get("/health", (req, res) => {
  res.send("Server running");
});

const start = async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT);
  });
};

start();