/*
 * @Author: 黄纯峰
 * @Date: 2022-03-15 10:51:07
 * @LastEditTime: 2022-03-22 16:00:48
 * @Version: 1.0
 * @Description: TODO
 */

import { BasicColumn } from '../components/Table';
import { defHttp } from '../utils/http/axios';
import { QueryOrder } from './common';
import { ErrorMessageMode } from '/#/axios';

export interface AdminInfoModel {
  userId: string;
  username: string;
  avatar: string;
  desp: string;
  lastLoginTime: string;
  createdTime: string;
  phone: string;
  email: string;
  clgName?: string;
}

export enum AdminRoleTypeEnum {
  SYSTEM = 'SYSTEM',
  COLLEGE = 'COLLEGE',
  CLASS = 'CLASS',
}

export const adminColumns: BasicColumn[] = [
  {
    title: '工号',
    dataIndex: 'userId',
    fixed: 'left',
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
    title: '学院',
    dataIndex: 'clgName',
  },
  // {
  //   title: '角色',
  //   dataIndex: 'roles[0].roleName',
  //   width: 200,
  // },
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
  roleType: AdminRoleTypeEnum;
  collegeId?: string;
  classCode?: string;
  phone: string;
  email: string;
}

export interface AdminUpdateFormdata {
  avatar: string;
  desp: string;
  phone: string;
  email: string;
  adminId: string;
}

export type UserQuery = Partial<AdminInfoModel> & QueryOrder;

enum Api {
  BaseUrl = '/api/admin',
  AdminPage = '/api/admin',
  UserAdd = '/api/user',
  AdminUpload = '/api/admin/upload',
  TemplateDownload = '/api/admin/template',
}

export function getAdminPage(params: UserQuery, errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.get<AdminInfoModel[]>({ url: Api.AdminPage, params }, { errorMessageMode });
}

export function addUser(data: AddUserData, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.post({ url: Api.UserAdd, data }, { errorMessageMode });
}

export function uploadAdmin(file: File, errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.uploadFile<number>({ url: Api.AdminUpload }, { file }, { errorMessageMode });
}

export function downloadTemplate(errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.downloadFileByData({ url: Api.TemplateDownload }, { errorMessageMode });
}

export function updateAdmin(data: AdminUpdateFormdata) {
  return defHttp.put<boolean>({ url: Api.BaseUrl, data }, { errorMessageMode: 'message' });
}
