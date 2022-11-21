import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { trySignin, trySignup } from "./controllers/usersController.js";
import {
  deleteEntry,
  getWalletData,
  insertEntry,
} from "./controllers/walletController.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db("myWalletDB");
  console.log("Mongo server connected");
} catch (error) {
  console.log(error);
}

export const usersCollection = db.collection("users");
export const sessionsCollection = db.collection("sessions");
export const walletCollection = db.collection("wallet");

app.post("/", trySignin);

app.post("/signup", trySignup);

app.get("/mywallet", getWalletData);

app.delete("/mywallet", deleteEntry);

app.post("/entry/gain", insertEntry);

app.post("/entry/loss", insertEntry);

app.listen(5000, console.log("App running at port 5000"));
