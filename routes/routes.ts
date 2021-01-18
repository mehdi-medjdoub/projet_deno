import { Router } from 'https://deno.land/x/oak/mod.ts'
import { getBooks } from '../controllers/books.ts'
import { home, notfound } from '../controllers/home.ts'

const router = new Router()

router.get('/books', getBooks)
    .get('/', home)



export default router