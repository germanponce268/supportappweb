export class User {
    id!: number;
    userId : string;
    firstName : string;
    lastname : string;
    username:string;
    email : string;
    loginDateDisplay! : Date;
    joinDate! : string;
    profileImageUrl! : string;
    active : boolean;
    notLocked : boolean;
    role : string;
    authorities : []; 

    constructor(){
        this.userId = '';
        this.firstName = '';
        this.lastname = '';
        this.username = '';
        this.email = '';
        this.active = false;
        this.notLocked = false;
        this.role = '';
        this.authorities = []; 
    }
}