//useless
export default interface UserInterfaces { 

    _id: { $oid: string } | null | string;

    email: string;
    password: string;
    sexe: string;
    dateNaissance: string;
    subscription: string;

    // getAge(): Number;
    // fullName(): string;
    insert(): Promise<void> ;
    getUser(email: string, password: string): Promise<UserInterfaces>;
    // update(): Promise <any> ;
    // delete(): Promise < any > ;
}