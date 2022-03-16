/*
 * @Author: 黄纯峰
 * @Date: 2022-03-15 10:51:07
 * @LastEditTime: 2022-03-16 19:26:33
 * @Version: 1.0
 * @Description: TODO
 */

import { BasicColumn } from '../components/Table';
import { defHttp } from '../utils/http/axios';
import { QueryOrder } from './base';
import { ErrorMessageMode } from '/#/axios';

export interface UserModel {
  id: number;
  username: string;
  avatar: string;
  desp: string;
  lastLoginTime: string;
  createdTime: string;
  phone: string;
  email: string;
}

export enum RoleType {
  SYSTEM = 'SYSTEM',
  COLLEGE = 'COLLEGE',
  CLASS = 'CLASS',
}

export const userColumns: BasicColumn[] = [
  {
    title: '工号',
    dataIndex: 'id',
  },
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    slots: { customRender: 'avatar' },
  },
  {
    title: '上次登录',
    dataIndex: 'lastLoginTime',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
  },
];

interface AddUserData {
  username: string;
  password: string;
  roleType: RoleType;
  collegeId?: string;
  classCode?: string;
  phone: string;
  email: string;
}

export type UserQuery = Partial<UserModel> & QueryOrder;

enum Api {
  UserList = '/api/user',
  UserAdd = '/api/user',
}

export function getUserList(params: UserQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<UserModel>({ url: Api.UserList, params }, { errorMessageMode });
}

export function addUser(data: AddUserData, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.post({ url: Api.UserAdd, data }, { errorMessageMode });
}
