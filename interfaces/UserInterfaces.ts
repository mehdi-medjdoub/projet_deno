declare enum Sexe {
    Homme,
    Femme,
    Autre
 }

declare enum Role { //à modifier
    User,
    Admin,
    Autre
 }

export default interface UserInterfaces { 

    _id: { $oid: string } | null | string;
    
    firstname: string;
    lastname?: string;
    email?: string;
    password?: string;
    sexe?: Sexe;
    role?: Role;
    dateNaiss?: Date;
    createdAt?: Date;
    updateAt?: Date;
    subscription?: Boolean | false
    //phoneNumber ? : string;


    getAge(): Number;
    fullName(): string;
    insert(): Promise<void> ;
    update(): Promise <any> ;
    delete(): Promise < any > ;
}