import { Router } from "https://deno.land/x/oak/mod.ts";
import { home, notfound } from "../controllers/home.ts";
import { login, register, subscription, user, deleteUser, userOff, addChild, deleteChild, getChild, editChild } from "../controllers/user.ts";
import { getAllSong, getOneSong, cart, bill } from "../controllers/audio.ts";

const router = new Router();

router
  //liste routes du xmind
  .get("/", home)
  .post("/login", login)
  .post("/register", register)
  .put("/subscription", subscription)
  .put("/user", user)
  .delete("/user/off", userOff)
  .delete("/user", deleteChild)
  .post("/user/child", addChild)
  .get("/user/child", getChild)
  .put("/user/cart", cart)
  .delete("/user", deleteChild)
  .get("/songs", getAllSong)
  //.get("/songs2", getAllSong2)
  .get("/songs/:id", getOneSong)
  .get("/bill", bill)

  .get("/(.*)", notfound)
  .post("/(.*)", notfound)
  .put("/(.*)", notfound)
  .delete("/(.*)", notfound)

export default router;
