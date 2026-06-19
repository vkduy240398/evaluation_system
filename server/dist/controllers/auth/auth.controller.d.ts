import { Request, Response } from 'express';
export declare class AuthController {
    private authService;
    private verifyTokenService;
    private userService;
    login(req: Request, res: Response): void;
    verifyToken(req: Request, res: Response): Promise<{
        userData: import("../../interfaces/user.interfaces").UserType;
    }>;
    refreshToken(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): void;
    selectCompany(req: Request, res: Response): Promise<void>;
}
