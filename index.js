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
let tableName;
let tableData;

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
      tableName = queryRes.rows[i].table_name;
      await db.createCollection(queryRes.rows[i].table_name);
      const GET_TABLE_DATA = `SELECT * FROM ${tableName}`;
      tableData = await clientPG.query(GET_TABLE_DATA);
      await db.collection(tableName).insertMany(tableData.rows);
    }
    console.log("Data migrated!");

    const result = await db
      .collection("recipes")
      .aggregate([
        {
          $lookup: {
            from: "recipecategories",
            localField: "recipe_id",
            foreignField: "recipe_id",
          },
        },
        { $unwind: "$recipecategories" },
        {
          $lookup: {
            from: "categories",
            localField: "recipecategories.category_id",
            foreignField: "category_id",
          },
        },
        { $unwind: "$categories" },
        {
          $match: {
            "categories.category_name": "No-Bake",
          },
        },
        {
          $group: {
            _id: {
              recipe_name: "$recipe_name",
              category_name: "$categories.category_name",
            },
          },
        },
        {
          $project: {
            _id: 0,
            recipe_name: "$_id.recipe_name",
            category_name: "$_id.category_name",
          },
        },
      ])
      .toArray();

    if (result.length > 0) {
      console.log("\nNo-baking cake recipes:", JSON.stringify(result, null, 2));
    } else {
      console.log("There are no cake recipes without baking step in our DB");
    }
  } catch (err) {
    console.error("Error migrating data:", err);
  } finally {
    clientMongo.close();
    clientPG.end();
  }
}

migrateSQLtoMongo();
