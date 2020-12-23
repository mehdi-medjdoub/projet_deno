import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { UserDB } from '../db/UserDB.ts';

export class UserModels extends UserDB implements UserInterfaces{

    _id:{ $oid: string }|null = null;

    email: string;
    password: string;
    sexe: string;
    dateNaissance: string;
    subscription: string;
    
    constructor(email: string, password: string, sexe: string, dateNaissance: string, subscription: string)
    {
        super();
        this.email = email;
        this.password = password;
        this.sexe = sexe;
        this.dateNaissance = dateNaissance;
        this.subscription = subscription;
    }

    async getUser(email: string, password: string): Promise<UserInterfaces> {
        return await this.userdb.findOne({email:email,password:password});
    }

    async insert(): Promise<void> {
        this._id = await this.userdb.insertOne({
            email: this.email,
            password: this.password,
            sexe: this.sexe,
            dateNaissance: this.dateNaissance,
            subscription: this.subscription,
        });

    }
}
