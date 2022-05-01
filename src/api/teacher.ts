import { usePermission } from '/@/hooks/web/usePermission';
import { TEACHER_PWDRESET, TEACHER_DELETE } from './../store/modules/Authority';
import { GenderEnum } from './../enums/genderEnum';
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
import { calcColWidth } from '../utils/actionCol';

const authorities = [TEACHER_PWDRESET, TEACHER_DELETE];
const { hasAnyAuthority } = usePermission();

export interface TeacherInfoModel {
  teaId: string;
  teaName: string;
  avatar: string;
  email: string;
  teaLastLogin: string;
  phone: string;
  clgCode: string;
  clgName: string;
  teaGender: GenderEnum;
  principal: boolean;
}

export enum AdminRoleTypeEnum {
  SYSTEM = 'SYSTEM',
  COLLEGE = 'COLLEGE',
  CLASS = 'CLASS',
}

export const teaColumns: BasicColumn[] = [
  {
    title: '工号',
    dataIndex: 'teaId',
    fixed: 'left',
  },
  {
    title: '用户名',
    dataIndex: 'teaName',
  },
  {
    title: '性别',
    slots: { customRender: 'gender' },
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
    title: '学院',
    dataIndex: 'clgName',
  },
  {
    title: '身份',
    dataIndex: 'principal',
    slots: { customRender: 'principal' },
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    slots: { customRender: 'avatar' },
  },
  {
    title: '上次登录',
    dataIndex: 'teaLastLogin',
  },
  {
    title: '创建时间',
    dataIndex: 'teaCreated',
  },
  {
    width: calcColWidth(authorities),
    title: '操作',
    fixed: 'right',
    dataIndex: 'action',
    slots: { customRender: 'action' },
    ifShow: () => hasAnyAuthority(authorities),
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

export interface TeacherListInfoModel {
  teaId: string;
  teaName: string;
  clgCode?: string;
  clgName?: string;
}

export type UserQuery = Partial<TeacherInfoModel> & QueryOrder;

enum Api {
  BaseUrl = '/api/teacher',
  ListTeacher = '/api/teacher/list',
  TeacherUpload = '/api/teacher/upload',
  TemplateDownload = '/api/teacher/template',
  ResetPwd = '/api/teacher/resetPwd',
}

export function pageTeacher(params: UserQuery, errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.get<TeacherInfoModel[]>({ url: Api.BaseUrl, params }, { errorMessageMode });
}

export function addUser(data: AddUserData, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.post({ url: '/', data }, { errorMessageMode });
}

export function uploadAdmin(file: File, errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.uploadFile<number>({ url: Api.TeacherUpload }, { file }, { errorMessageMode });
}

export function downloadTemplate(errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.downloadFileByData({ url: Api.TemplateDownload }, { errorMessageMode });
}

/* 优化 TODO */
export function listTeacher() {
  return defHttp.get<TeacherListInfoModel[]>(
    { url: Api.ListTeacher },
    { errorMessageMode: 'message' },
  );
}

export function resetTeaPwd(teaId: string) {
  return defHttp.put<boolean>({ url: Api.ResetPwd + `/${teaId}` }, { errorMessageMode: 'message' });
}

export function deleteTeacher(teaId: string) {
  return defHttp.delete<boolean>(
    { url: Api.BaseUrl + `/${teaId}` },
    { errorMessageMode: 'message' },
  );
}
