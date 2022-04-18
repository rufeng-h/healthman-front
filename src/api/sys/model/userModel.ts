import { GenderEnum } from './../../../enums/genderEnum';
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

export enum RoleTypeEnum {
  COLLEGE = 'COLLEGE',
  CLASS = 'CLASS',
  SYSTEM = 'SYSTEM',
  STUDENT = 'STUDENT',
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
  lastModifyTime: string;
  desp: string;
  roles: RoleInfoModel[];
  userType: UserTypeEnum;
  gender: GenderEnum;
  birth: string;
  email?: string;
  phone?: string;
  clgName?: string;
  clsName?: string;
}

export interface RoleInfoModel {
  roleName: string;
  roleValue: number;
  roleCreated: string;
  roleId: string;
  roleType: RoleTypeEnum;
  target: string | undefined;
}
