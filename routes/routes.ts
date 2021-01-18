import { Router } from 'https://deno.land/x/oak/mod.ts'
import { getBooks } from '../controllers/books.ts'
import { home, notfound } from '../controllers/home.ts'
import * as todo from "../controllers/todo.ts"

const router = new Router()

router.get('/books', getBooks)
    .get('/', home)
    .post('/login', home)
    
    .get('/todos', todo.default.getAllTodos)
    .post('/todos', todo.default.createTodo)

    
    .get('/(.*)', notfound)
    .post('/(.*)', notfound)


export default router