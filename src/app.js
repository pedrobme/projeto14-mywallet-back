import express, { application } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { trySignin, trySignup } from "./controllers/usersController.js";
import { getWalletData, insertEntry } from "./controllers/walletController.js";

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db("myWalletDB");
  console.log("Mongo server connected");
} catch (error) {
  console.log(error);
}

export let usersCollection = db.collection("users");
export let sessionsCollection = db.collection("sessions");
export let walletCollection = db.collection("wallet");

app.post("/", trySignin);

app.post("/signup", trySignup);

app.get("/mywallet", getWalletData);

app.post("/entry/gain", insertEntry);

app.post("/entry/loss", insertEntry);

app.listen(5000, console.log("App running at port 5000"));
