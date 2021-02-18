import { dataRequest, deleteMapper, exist, getChildsByParent, isValidPasswordLength, passwordFormat, dataResponse, textFormat, numberFormat } from "../middlewares/index.ts";
import { UserModels } from "../Models/UserModels.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";//download
import { UserDB } from "../db/userDB.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import FactureInterfaces from "../interfaces/FactureInterfaces.ts";
import { config } from '../config/config.ts';
import { getAuthToken, getJwtPayload } from "../helpers/jwt.helpers.ts";
import { Bson } from "https://deno.land/x/mongo@v0.20.1/mod.ts";
import { play } from "https://deno.land/x/audio@0.1.0/mod.ts";//download
import { SongDB } from "../db/SongDB.ts";
import { FactureDB } from "../db/FactureDB.ts";
import SongInterfaces from "../interfaces/SongInterfaces.ts";

//const songsCollection = db.collection('songs')

export const getAllSong = async (ctx: RouterContext) => {
  const payloadToken = await getJwtPayload(ctx, ctx.request.headers.get("Authorization"));// Payload du token
  if(payloadToken === null || payloadToken === undefined){
      return dataResponse(ctx, 401, { error: true, message: "Votre token n'est pas correct"})
  }else{
      const dbCollection = new UserDB();
      let user = await dbCollection.selectUser({ _id: new Bson.ObjectId(payloadToken.id) })
      //let utilisateur = new UserModels(user.email, user.password, user.lastname, user.firstname, user.dateNaissance, user.sexe, user.attempt, user.subscription);
      if(user.subscription === 0){
          return dataResponse(ctx, 403, { error: true, message: "Votre abonnement ne permet pas d'accéder à la ressource"})
      }else{
          let songs = await new SongDB().selectAllSongs({})
          return dataResponse(ctx, 200, { error: false, songs: songs.map((item: SongInterfaces) => deleteMapper(item, 'getSongs'))})
      }
  }
}


export const getOneSong = async (ctx: RouterContext) => {
  const data = await dataRequest(ctx);
  const idSong = parseInt(<string>ctx.params.id);
  const payloadToken = await getJwtPayload(ctx, ctx.request.headers.get("Authorization"));// Payload du token
  if(payloadToken === null || payloadToken === undefined){
      return dataResponse(ctx, 401, { error: true, message: "Votre token n'est pas correct"})
  }else{
      const dbCollection = new UserDB();
      let user = await dbCollection.selectUser({ _id: new Bson.ObjectId(payloadToken.id) })
      if(user.subscription === 0){
          return dataResponse(ctx, 403, { error: true, message: "Votre abonnement ne permet pas d'accéder à la ressource"})
      }else{
          if(idSong === null || !exist(String(idSong))) return dataResponse(ctx, 400, { error: true, message: "Une ou plusieurs données obligatoire sont manquantes"})///
          if(!numberFormat(String(idSong)) || idSong < 1 || await new SongDB().count({ id: idSong }) === 0) return dataResponse(ctx, 409, { error: true, message: "Une ou plusieurs données sont erronées"})///
          let song = await new SongDB().selectSong({id:idSong})
          play(song.url)
          return dataResponse(ctx, 201, { error: false, songs: deleteMapper(song,'getSong')})
      }
  }
  
}
  
export const cart = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};
export const bill = async (ctx: RouterContext) => {
  const payloadToken = await getJwtPayload(ctx, ctx.request.headers.get("Authorization"));// Payload du token
  if (payloadToken === null || payloadToken === undefined ) return dataResponse(ctx, 401, { error: true, message: "Votre token n'est pas correct"})
  const dbCollection = new UserDB();
  const userParent = await dbCollection.selectUser({ _id: new Bson.ObjectId(payloadToken.id) })
  if (userParent.role !== 'Tuteur') return dataResponse(ctx, 403, { error: true, message: "Vos droits d'accès ne permettent pas d'accéder à la ressource"})
  //await addBill(payloadToken.id) // ajout facture
  const factures = await new FactureDB().selectAllFactures({ idUser : payloadToken.id });
  return dataResponse(ctx, 200, { error: false, bill: factures.map((item: FactureInterfaces) => deleteMapper(item, 'getBills'))})
}
