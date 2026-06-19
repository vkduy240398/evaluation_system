import { RoleRepository } from 'src/repository/role.repository';
export declare class RoleService {
    private roleRepo;
    constructor(roleRepo: RoleRepository);
    getAllRole(): Promise<import("../entity/Role").Role[]>;
}
