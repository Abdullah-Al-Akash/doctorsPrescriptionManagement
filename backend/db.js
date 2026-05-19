const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("hospital");
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };