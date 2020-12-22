import { Books } from "../types/types.ts";

let books: Books[] = [
  {
    id: "1",
    title: "The Hobbit",
    author: "J. R. R. Tolkien",
    price: 200,
  },
  {
    id: "2",
    title: "Harry Potter",
    author: "J. K. Rowling",
    price: 400,
  },
  {
    id: "3",
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 350,
  },
];

export const getBooks = ({ response }: { response: any }) => {
  response.status = 200
  response.body = {
      success: true,
      data: books
  }
}
