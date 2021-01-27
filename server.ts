import { Application } from 'https://deno.land/x/oak/mod.ts'
import router from './routes/routes.ts'
import { opine, json, urlencoded } from "https://deno.land/x/opine@1.0.2/mod.ts";
//import { routes } from "routes/index.ts"

const port = 8000;
const app2 = opine();
const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

// ca c'est pour opine si on change
//app.use(json()); // for parsing application/json
//app.use(urlencoded()); // for parsing application/x-www-form-urlencoded
//app.use('/', routes)

console.log(`Server running on port ${port}`)

await app.listen({ port })

// deno run --allow-net --allow-read server.ts