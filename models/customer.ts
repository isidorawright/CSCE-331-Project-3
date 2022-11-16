export enum UserRole {
  MANAGER = "Manager",
  SERVER = "Server",
  CUSTOMER = "Customer",
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  authenticated: boolean;
  role: UserRole;
}

export function User(user?: IUser): IUser {
  if (user) {
    return user;
  }
  return {
    id: -1,
    firstName: "",
    lastName: "",
    email: "",
    authenticated: false,
  } as IUser;
}
