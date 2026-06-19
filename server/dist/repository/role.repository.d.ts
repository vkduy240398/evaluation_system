import { Role } from 'src/entity/Role';
export declare class RoleRepository {
    private roleRepository;
    getAllRole(): Promise<Role[]>;
}
