import { dataRequest, deleteMapper, exist, isValidLength, isValidPasswordLength, passwordFormat, dataResponse, textFormat } from "../middlewares/index.ts";
import { UserModels } from "../Models/UserModels.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";//download
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.0/mod.ts";//download
import { comparePass } from "../helpers/password.helpers.ts";
import { UserDB } from "../db/userDB.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { config } from '../config/config.ts';
import { getAuthToken, getJwtPayload } from "../helpers/jwt.helpers.ts";
import DateException from "../exceptions/DateException.ts";
import EmailException from "../exceptions/EmailException.ts";
import { Bson } from "https://deno.land/x/mongo@v0.20.1/mod.ts";
import {sendMail} from "../helpers/mail.ts"
import { addCustomerStripe, deleteCustomerStripe, updateCustomerStripe } from "../middlewares/stripe.ts";


/**
 *  Route login user
 *  @param {RouterContext} ctx 
 */ 
export const login = async (ctx: RouterContext) => {
  const data = await dataRequest(ctx);
  // Vérification de si les données sont bien présentes dans le body
  if(data === undefined || data === null) return dataResponse(ctx, 400, { error: true, message: 'Email/password manquants'})
  if(exist(data.Email) == false || exist(data.Password) == false){
      return dataResponse(ctx, 400, { error: true, message: 'Email/password manquants'})
  }else{
      //const user: any = await db.collection('users').findOne({ email: Email.trim().toLowerCase() })
      if(!EmailException.isValidEmail(data.Email) || !passwordFormat(data.Password)){
          return dataResponse(ctx, 400, { error: true, message: 'Email/password incorrect'});
      }else{
          const dbCollection =  new UserDB();
          const user = await dbCollection.selectUser({email : data.Email.trim().toLowerCase()})
          if (user == undefined || user == null) {
              return dataResponse(ctx, 400, { error: true, message: 'Email/password incorrect'})
          }else{
              const isValid = await comparePass(data.Password, user.password); //verification password
              let utilisateur = new UserModels(user.email, user.password, user.lastname, user.firstname, user.dateNaissance, user.sexe, user.attempt, user.subscription);
              if(isValid){ // true
                  if(user.attempt >= 5 && ((<any>new Date() - <any>user.updateAt) / 1000 / 60) <= 2){
                      return dataResponse(ctx, 429, { error: true, message: "Trop de tentative sur l'email " + data.Email + " (5 max) - Veuillez patienter (2min)"});
                  }else{
                      const jwtToken = await getAuthToken(user._id);// génération du token
                      user.token = jwtToken;
                      utilisateur.setId(<{ $oid: string }>user._id);
                      let isSuccess = await utilisateur.update(user);
                      if(isSuccess || isSuccess === 1)
                          return dataResponse(ctx, 200, { error: false, message: "L'utilisateur a été authentifié succès" , user: deleteMapper(user), token: jwtToken})
                      else
                          return dataResponse(ctx, 400, { error: true, message: 'Email/password incorrect'})// Cette erreur ne doit jamais apparaitre
                  }
              }else{ // false
                  if(user.attempt >= 5 && ((<any>new Date() - <any>user.updateAt) / 1000 / 60) <= 2){
                      return dataResponse(ctx, 429, { error: true, message: "Trop de tentative sur l'email " + data.Email + " (5 max) - Veuillez patienter (2min)"});
                  }else if(user.attempt >= 5 && ((<any>new Date() - <any>user.updateAt) / 1000 / 60) >= 2){
                      user.updateAt = new Date();
                      user.attempt = 1;
                      utilisateur.setId(<{ $oid: string }>user._id);
                      let isSuccess = await utilisateur.update(user);
                      if(isSuccess || isSuccess === 1)
                          return dataResponse(ctx, 400, { error: true, message: 'Email/password incorrect'})
                      else
                          return dataResponse(ctx, 500, { error: true, message: 'Error process'})// Cette erreur ne doit jamais apparaitre
                  }else{
                      user.updateAt = new Date();
                      user.attempt = user.attempt + 1;
                      utilisateur.setId(<{ $oid: string }>user._id);
                      let isSuccess = await utilisateur.update(user);
                      if(isSuccess || isSuccess === 1)
                          return dataResponse(ctx, 400, { error: true, message: 'Email/password incorrect'})
                      else
                          return dataResponse(ctx, 500, { error: true, message: 'Error process'})// Cette erreur ne doit jamais apparaitre
                  }
              }
          }
      } 
  }
}

/**
 *  Route inscription
 *  @param {RouterContext} ctx
 */ 
export const register = async (ctx: RouterContext) => {
  const data = await dataRequest(ctx);
  if(data === undefined || data === null || exist(data.email) == false || exist(data.password) == false || exist(data.lastname) == false || exist(data.firstname) == false || exist(data.date_naissance) == false || exist(data.sexe) == false ){
      return dataResponse(ctx, 400, { error: true, message: "Une ou plusieurs données obligatoire sont manquantes"})
  }else{
      if(!EmailException.isValidEmail(data.email) || !DateException.isValidDate(data.date_naissance) || !passwordFormat(data.password) ||
      (data.sexe.toLowerCase() !== "homme" && data.sexe.toLowerCase() !== "femme") || !textFormat(data.firstname) || !textFormat(data.lastname)){
          return dataResponse(ctx, 409, { error: true, message: "Une ou plusieurs données sont erronées"})   
      }else{
          const dbCollection = new UserDB();
          if(await dbCollection.count({email: data.email.trim().toLowerCase()}) !== 0){
              return dataResponse(ctx, 409, { error: true, message: "Un compte utilisant cette adresse mail est déjà enregistré"})  
          }else{
              //insertion dans la base de données 
              let utilisateur = new UserModels(data.email, data.password, data.lastname, data.firstname, data.date_naissance, data.sexe, 0, 0);
              const utilisateurId = await utilisateur.insert();
              const customerId =  (await addCustomerStripe(data.email, data.firstname + ' ' + data.lastname)).data.id ;
              utilisateur.setId(<{ $oid: string}>utilisateurId)
              await utilisateur.update({customerId: customerId})                
              const user = await new UserDB().selectUser({ _id: new Bson.ObjectId(utilisateurId) })
              await sendMail(data.email.trim().toLowerCase(), "Welcome!", "Bienvenue sur deno radio feed!")
              return dataResponse(ctx, 201, { error: false, message: "L'utilisateur a bien été créé avec succès", user: deleteMapper(user) })
          }
      }
  }   
}

export const subscription = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};

export const user = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};

/**
 *  Route delete user
 *  @param {RouterContext} ctx
 */ 
export const deleteUser = async (ctx: RouterContext) => {
  const payloadToken = await getJwtPayload(ctx, ctx.request.headers.get("Authorization"));// Payload du token
  //if (payloadToken === false) return dataResponse(ctx, 409, { error: true, message: "Une ou plusieurs données sont erronées"})//error taille du token invalide
  if(payloadToken === null || payloadToken === undefined /*|| payloadToken.role !== 'Tuteur'*/){
      return dataResponse(ctx, 401, { error: true, message: "Votre token n'est pas correct"})
  }else{
      const dbCollection = new UserDB();
      let userParent = await dbCollection.selectUser({ _id: new Bson.ObjectId(payloadToken.id) })
      for(let i = 0; i < userParent.childsTab.length; i++){
          await new UserDB().delete({ _id: userParent.childsTab[i] })
      }
      await dbCollection.delete({ _id: new Bson.ObjectId(payloadToken.id) })
      await deleteCustomerStripe(userParent.customerId)
      return dataResponse(ctx, 200, { error: false, message: 'Votre compte et le compte de vos enfants ont été supprimés avec succès' })
  }
}

export const userOff = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};

export const addChild = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};
export const deleteChild = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};
export const getChild = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};
export const editChild = ({ response }: { response: any }) => {
  response.status = 200;
  response.body = {
    success: true,
    data: [],
  };
};
