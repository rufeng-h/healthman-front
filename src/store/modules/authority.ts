import { RoleInfo } from './../../../types/store.d';
const INSERT_MASK = 0x8;
const DELETE_MASK = 0x4;
const UPDATE_MASK = 0x2;
const SELECT_MASK = 0x1;
export const ROLE_PREFIX = 'ROLE_';
export function role2Authorities(roles: RoleInfo[]): string[] {
  const authorities: string[] = [];
  roles.forEach((role) => {
    const value = role.roleValue;
    const target = role.target;
    const r = ROLE_PREFIX + role.roleType;
    if (authorities.indexOf(r) === -1) {
      authorities.push(r);
    }
    if ((value & SELECT_MASK) != 0) {
      authorities.push(target + ':' + 'SELECT');
    }
    if ((value & UPDATE_MASK) != 0) {
      authorities.push(target + ':' + 'UPDATE');
    }
    if ((value & DELETE_MASK) != 0) {
      authorities.push(target + ':' + 'DELETE');
    }
    if ((value & INSERT_MASK) != 0) {
      authorities.push(target + ':' + 'INSERT');
    }
  });
  return authorities;
}
