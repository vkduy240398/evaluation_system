import { Roles } from 'src/enum/Roles';
export declare const ROLES_KEY = "roles";
export declare const Authorize: (role: Roles) => import("@nestjs/common").CustomDecorator<string>;
