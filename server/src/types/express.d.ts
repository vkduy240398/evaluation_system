import { UserType } from '/src/interfaces/user.interfaces';

declare module 'express' {
  interface Request {
    user: UserType;
  }
}
export {};
