import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { trySignin, trySignup } from "./controllers/userController.js";

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

app.post("/", (req, res) => trySignin(req, res));

app.post("/signup", (req, res) => trySignup(req, res));

app.listen(5000, console.log("App running at port 5000"));
