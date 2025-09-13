import { MongoClient } from "mongodb";
import { config as configDotenv } from "dotenv";
configDotenv({ silent: true });
const url = process.env.MONGODB_URL;
const clientMongo = new MongoClient(url);

import { Client } from "pg";
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "prepExDBw3",
  port: 5432,
};
const clientPG = new Client(config);
let queryRes;

clientPG.connect();
queryRes = await clientPG.query("SELECT * FROM recipes;");
console.log("\nrecipes:", JSON.stringify(queryRes.rows, null, 2));
clientPG.end();

async function createCollection() {
  try {
    await clientMongo.connect();
    const db = clientMongo.db("prepExDBw4");
    await db.createCollection("myCollection");
    console.log("Collection created!");
  } catch (err) {
    console.error("Error creating collection:", err);
  } finally {
    await clientMongo.close();
  }
}

createCollection();
