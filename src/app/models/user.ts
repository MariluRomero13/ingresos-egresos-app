export interface IUser {
  username: string;
  email: string;
  password: string;
}

export class User {
  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {}
}
