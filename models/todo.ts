import client from "../db/client.ts";
// config
import { TABLE } from "../db/config.ts";
// Interface
import Todo from "../interfaces/Todo.ts";

export default {
  /**
   * Takes in the id params & checks if the todo item exists
   * in the database
   * @param id
   * @returns boolean to tell if an entry of todo exits in table
   */
  doesExistById: async ({ id }: Todo) => {},
  /**
   * Will return all the entries in the todo column
   * @returns array of todos
   */
  getAll: async () => {
    return await client.query(`SELECT * FROM ${TABLE.TODO}`);
  },
  /**
   * Takes in the id params & returns the todo item found
   * against it.
   * @param id
   * @returns object of todo item
   */
  getById: async ({ id }: Todo) => {},
  /**
   * Adds a new todo item to todo table
   * @param todo
   * @param isCompleted
   */
  add: async (
    { todo, isCompleted }: Todo,
  ) => {return await client.query(
    `INSERT INTO ${TABLE.TODO}(todo, isCompleted) values(?, ?)`,
    [
      todo,
      isCompleted,
    ],
  );
},
  /**
   * Updates the content of a single todo item
   * @param id
   * @param todo
   * @param isCompleted
   * @returns integer (count of effect rows)
   */
  updateById: async ({ id, todo, isCompleted }: Todo) => {},
  /**
   * Deletes a todo by ID
   * @param id
   * @returns integer (count of effect rows)
   */
  deleteById: async ({ id }: Todo) => {},
};