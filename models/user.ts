import client from "../db/client.ts";
// config
import { TABLE } from "../db/config.ts";
// Interface
import User from "../interfaces/User.ts";

export default {
  /**
   * Takes in the id params & checks if the user item exists
   * in the database
   * @param id
   * @returns boolean to tell if an entry of user exits in table
   */
  doesExistById: async ({ id }: User) => {},
  /**
   * Will return all the entries in the user column
   * @returns array of todos
   */
  getAll: async () => {
    return await client.query(`SELECT * FROM ${TABLE.USER}`);
  },
  /**
   * Takes in the id params & returns the user item found
   * against it.
   * @param id
   * @returns object of user item
   */
  getById: async ({ id }: User) => {},
  /**
   * Adds a new user item to user table
   * @param user
   * @param firstname
   */
  add: async (
    { firstname }: User,
  ) => {return await client.query(
    `INSERT INTO ${TABLE.USER}(user, firstname) values(?, ?)`,
    [
      firstname,
    ],
  );
},
  /**
   * Updates the content of a single user item
   * @param id
   * @param firstname
   * @returns integer (count of effect rows)
   */
  updateById: async ({ id, firstname }: User) => {},
  /**
   * Deletes a user by ID
   * @param id
   * @returns integer (count of effect rows)
   */
  deleteById: async ({ id }: User) => {},
};