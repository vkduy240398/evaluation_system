import { SetMetadata, UseGuards } from '@nestjs/common';
import { Roles } from 'src/enum/Roles';
import { JwtAuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/role.guard';

export const ROLES_KEY = 'roles';

/**
 * Set role for current route handler method.
 *
 * @author tran.le.ha.nam
 * @last_update tran.le.ha.nam
 */
export const Authorize = (role: Roles) => SetMetadata(ROLES_KEY, role);
