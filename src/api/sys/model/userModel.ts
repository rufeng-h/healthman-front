import type { RoleInfo, UserInfo } from '/#/store';

export enum UserTypeEnum {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
}

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  userId: string;
  password: string;
  userType: UserTypeEnum;
}

/**
 * @description: Login interface return value
 */
export interface LoginResult {
  userInfo: UserInfo;
  token: string;
  role: RoleInfo;
}
