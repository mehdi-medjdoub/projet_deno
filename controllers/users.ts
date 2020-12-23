import { UserModels } from "../Models/UserModels.ts";

export const login = async ({ request, response }: { request: any, response: any }) => {
    const body = await request.body().value

    if(!body.email || !body.password) {
        response.status = 400
        response.body = {
            error: true,
            message: "Email/password manquants",
        }
    }
    // error: TS2339 [ERROR]: Property 'getUser' does not exist on type 'typeof UserModels'
    const user = await UserModels.getUser(body.email, body.password)
    console.log(user)

    if(!user) {
        response.status = 400
        response.body = {
            error: true,
            message: "Email/password incorrect",
        }
    }
    
    // response.status = 429
    // response.body = {
    //     error: true,
    //     message: "Trop de tentative sur l'email (5 max) - Veuillez patienter (2min)",
    // }
    
    response.body = {
        error: false,
        message: "L'utilisateur a été authentifié avec succès",
        user: {
            "firstname":"",
            "lastname":"",
            "email":"",
            "sexe":"",
            "role":"",
            "dateNaissance":"",
            "createdAt":"",
            "updateAt":"",
            "subscription":1
        }
    }
    
}