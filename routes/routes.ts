import { Router } from 'https://deno.land/x/oak/mod.ts'
import { getBooks } from '../controllers/books.ts'

const router = new Router()

router.get('/books', getBooks)

export default router