import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";
config({ silent: true });

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

async function createCollection() {
  try {
    await client.connect();
    const db = client.db("prepExDBw4");
    await db.createCollection("myCollection");
    console.log("Collection created!");
  } catch (err) {
    console.error("Error creating collection:", err);
  } finally {
    await client.close();
  }
}

createCollection();
