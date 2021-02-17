import { dataRequest, deleteMapper, exist, getChildsByParent, isValidPasswordLength, passwordFormat, dataResponse, textFormat } from "../middlewares/index.ts";
import { RouterContext } from "https://deno.land/x/oak@v6.4.0/router.ts";
import { play } from "https://deno.land/x/audio@0.1.0/mod.ts";//download
import { db } from "../db/db.ts"

const songsCollection = db.collection('songs')

export const getAllSong = async (ctx: RouterContext) => {
  const songs = await songsCollection.find();
  ctx.response.body = songs;
};
export const getAllSong2 = ({ response }: { response: any }) => {
  const songsCollection = db.collection("songs");
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};
export const getOneSong = async (ctx: RouterContext) => {
  const data = await dataRequest(ctx);
  const id = parseInt(<string>ctx.params.id);
  play(Deno.cwd().concat("/upload/Jax Jones - You Don't Know Me ft. RAYE.mp3"))
  return dataResponse(ctx, 200, { error: false, id: parseInt(<string>ctx.params.id)})
}
export const cart = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};
export const bill = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};
