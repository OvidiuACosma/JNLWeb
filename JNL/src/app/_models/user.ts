export class User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    token: string;
    type: string;
}

export interface IUserResetPassword {
  token: string;
  password: string;
}
