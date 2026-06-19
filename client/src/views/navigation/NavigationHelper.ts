import { Role } from '../../model/Role';

export class NavigationHelper {
  /**
   * Check role for current navigation item
   *
   * @author tran.le.ha.nam
   * @last_update
   * @param roles list role from credential
   * @param roleCheck your role value you want to check
   */
  public static isValidRole(roles: Role[], roleCheck: string) {
    return roles.some((role) => role.name === roleCheck);
  }

  /**
   * Check multiple roles for manual links
   *
   * @author tran.le.ha.nam
   */
  public static isValidMultipleRoles(currentRoles: Role[], roleChecks: string[]) {
    return roleChecks.some((roleToCheck) => currentRoles.map((role) => role.name).includes(roleToCheck));
  }
}
