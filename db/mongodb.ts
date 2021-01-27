import { MongoClient, Bson } from "https://deno.land/x/mongo@v0.21.0/mod.ts";
//EUFLatxbPC0i8BlM
const client = new MongoClient();
await client.connect("mongodb+srv://userdeno:EUFLatxbPC0i8BlM@deno.cdevd.mongodb.net/toast?retryWrites=true&w=majority");
//await client.connect("mongodb://localhost:27017");

const db = client.database("songs");

export default db;