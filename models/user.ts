export enum UserRole {
  MANAGER = "Manager",
  SERVER = "Server",
  CUSTOMER = "Customer",
}

export interface IUser {
  id: number;
  username: string;
  password?: string;
  authenticated: boolean;
  role: UserRole;
}

export function User(user?: IUser): IUser {
  if (user) {
    return user;
  }
  return {
    id: -1,
    username: "",
    authenticated: false,
    role: UserRole.CUSTOMER,
  } as IUser;
}
