import * as expressive from "https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts";
import getAllUsers from '../controller/AuthController.ts';
import {Router} from "https://deno.land/x/oak/mod.ts";


const authRoute: Router = new Router();

authRoute.get('/test', "toto");

export {authRoute}