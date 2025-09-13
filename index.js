import { MongoClient } from "mongodb";
import "dotenv/config";
const clientMongo = new MongoClient(process.env.MONGODB_URL);

import { Client } from "pg";
const configPG = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "prepExDBw3",
  port: 5432,
};
const clientPG = new Client(configPG);
let queryRes;

async function migrateSQLtoMongo() {
  try {
    await clientMongo.connect();
    const db = clientMongo.db("prepExDBw4");
    clientPG.connect();
    const GET_TABLE_NAMES = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = \'public\'
    AND table_type = \'BASE TABLE\';
    `;
    queryRes = await clientPG.query(GET_TABLE_NAMES);
    for (let i = 0; i < queryRes.rows.length; i++) {
      await db.createCollection(queryRes.rows[i].table_name);
    }
    console.log("Data migrated!");
  } catch (err) {
    console.error("Error migrating data:", err);
  } finally {
    clientMongo.close();
    clientPG.end();
  }
}

migrateSQLtoMongo();
