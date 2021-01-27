import { config } from "https://deno.land/x/dotenv/mod.ts";
export const conf = config();

export const DATABASE: string = "deno";
export const TABLE = {
  TODO: "todo",
};


//mysql