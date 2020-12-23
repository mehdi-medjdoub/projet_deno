import { Client } from "https://deno.land/x/mysql/mod.ts";
const client = await new Client().connect({
  hostname: "localhost",
  username: "root",
  db: "proutify",
  password: "",
});

//await client.execute(`CREATE DATABASE IF NOT EXISTS proutify`);
//await client.execute(`USE proutify`);

//creaion de la table
//await client.execute(`DROP TABLE IF EXISTS users`);
/* await client.execute(`
    CREATE TABLE users (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        created_at timestamp not null default current_timestamp,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`); */

let result = await client.execute(`INSERT INTO users(name) values(?)`, [
    "manyuanrong",
  ]);
  console.log(result);
  // { affectedRows: 1, lastInsertId: 1 }