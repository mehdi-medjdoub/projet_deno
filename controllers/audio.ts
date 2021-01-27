import { RouterContext } from "https://deno.land/x/oak@v6.4.0/router.ts";
import db from "../db/mongodb.ts";

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
export const getOneSong = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};
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
