import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { User } from 'src/entity/User';
import { UserRepository } from 'src/repository/user.repository';
import { UserType } from '../interfaces/user.interfaces';
export declare class VerifyTokenService {
    private readonly jwtService;
    private userRepository;
    private userRepo;
    constructor(jwtService: JwtService, userRepository: UserRepository);
    secretKey: string;
    cookieName: string;
    cookieRefreshName: string;
    private maxAgeCookie;
    private maxAgeRefreshCookie;
    processVerifyToken(token: string): UserType | null;
    checkRoles(currentUser: UserType, user: User): boolean;
    checkInfoUser(currentUser: UserType, res: Response, companyGroupCode: string): Promise<UserType>;
    verifyToken(accessToken: string, refreshToken: string, res: Response): UserType;
    getTokenFromCookie(request: Request): {
        accessToken: string;
        refreshToken: string;
    };
    setCookieToken(response: Response, accessToken: string, refreshToken: string, companyGroupCode?: string): void;
    clearCookie(response: Response): void;
    encodeJsonWebToken(data: any, options?: JwtSignOptions): string;
    decodeJsonWebToken(token: string): UserType;
    handleVerifyToken(email: string, companyGroupCode?: string): Promise<UserType>;
    refreshToken(req: Request): Promise<string>;
}
