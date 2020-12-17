export default interface UserInterfaces {

    _id: { $oid: string } | null | string;

    email: string;
 /*    password: string;
    lastname: string;
    firstname: string;
    phoneNumber ? : string;

    dateNaiss: Date; */

    getAge(): Number;
    fullName(): string;
    insert(): Promise<void> ;
    update(): Promise <any> ;
    delete(): Promise < any > ;
}