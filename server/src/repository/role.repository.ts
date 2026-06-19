import { Injectable, Inject } from '@nestjs/common';
import EntityConstant from 'src/constant/EntityConstant';
import { Role } from 'src/entity/Role';

@Injectable()
export class RoleRepository {
  @Inject(EntityConstant.ROLE)
  private roleRepository: typeof Role;

  async getAllRole() {
    return await this.roleRepository.findAll({
      attributes: ['id', 'name'],
    });
  }
}
