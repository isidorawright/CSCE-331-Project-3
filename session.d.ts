import * as IronSession from "iron-session";
import { IUser, UserRole } from "./models/user";

declare module "iron-session" {
  interface IronSessionData {
    user?: IUser;
  }
}
