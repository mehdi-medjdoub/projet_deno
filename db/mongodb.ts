import { MongoClient, Bson } from "https://deno.land/x/mongo@v0.21.0/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { conf } from './config.ts';

const client = new MongoClient();
await client.connect(conf.DB_URL);
//await client.connect("mongodb://127.0.0.1:27017");

const db = client.database("songs");

export default db;