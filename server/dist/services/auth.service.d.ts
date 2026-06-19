import { UserType } from '../interfaces/user.interfaces';
import { Response } from 'express';
export declare class AuthService {
    private verifyToken;
    private userRepo;
    authentication(email: string, password: string): Promise<UserType>;
    checkEmailExeption(email: string, password: string): boolean;
    checkLogin(user: any): {
        accessToken: string;
        refreshToken: string;
        user: any;
    };
    checkSelectGroup(email: string, companyGroupCode: string, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: UserType;
    }>;
}
export default AuthService;
