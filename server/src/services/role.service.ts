import { Injectable } from '@nestjs/common';
import { RoleRepository } from 'src/repository/role.repository';

@Injectable()
export class RoleService {
  // eslint-disable-next-line no-empty-function
  constructor(private roleRepo: RoleRepository) {}

  async getAllRole() {
    return await this.roleRepo.getAllRole();
  }
}
