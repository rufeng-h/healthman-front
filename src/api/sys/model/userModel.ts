import type { RoleInfo } from '/#/store';
import { UserTypeEnum } from '/@/enums/userTypeEnum';

/**
 * @description: Login interface parameters
 */
export interface LoginQuery {
  userId: string;
  password: string;
  userType: UserTypeEnum;
}

/**
 * @description: Login interface return value
 */
export interface LoginResult {
  userInfo: UserInfoModel;
  token: string;
  role: RoleInfo;
}

export interface UserInfoModel {
  userId: string;
  username: string;
  avatar: string;
  lastLoginTime: string;
  createdTime: string;
  desp: string;
  email?: string;
  phone?: string;
  roles: RoleInfoModel[];
}

export interface RoleInfoModel {
  roleName: string;
  value: string;
}
