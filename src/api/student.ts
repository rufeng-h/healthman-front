import { GenderEnum } from '../enums/genderEnum';
import { defHttp } from '../utils/http/axios';
import { QueryOrder } from './common';
import { ErrorMessageMode } from '/#/axios';
import { BasicColumn } from '/@/components/Table';

/*
 * @Author: 黄纯峰
 * @Date: 2022-03-13 20:33:26
 * @LastEditTime: 2022-03-24 18:21:43
 * @Version: 1.0
 * @Description: TODO
 */
export interface StudentInfoModel {
  sid: number;
  stuId: string;
  stuName: string;
  stuBirth: string;
  stuGender: GenderEnum;
  avatar: string;
  clsCode: string;
  clsName: string;
  stuLastLogin: string;
  stuCreated: string;
  stuDesp: string;
}

export interface StudentQuery extends QueryOrder {
  stuId?: string;
  stuName?: string;
  stuGender?: GenderEnum;
  clsCode?: string;
}

export const studentColumns: BasicColumn[] = [
  {
    title: '学号',
    dataIndex: 'stuId',
    slots: { customRender: 'number' },
    sorter: true,
  },
  {
    title: '姓名',
    dataIndex: 'stuName',
  },
  {
    title: '性别',
    dataIndex: 'stuGender',
    slots: { customRender: 'gender' },
    filterMultiple: false,
    filters: [
      {
        text: 'male',
        value: 'M',
      },
      {
        text: 'female',
        value: 'F',
      },
    ],
  },
  {
    title: '班级',
    dataIndex: 'clsName',
  },
  {
    title: '出生日期',
    dataIndex: 'stuBirth',
    sorter: true,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    slots: { customRender: 'avatar' },
  },
  {
    title: '上次登录',
    dataIndex: 'stuLastLogin',
  },
];

enum Api {
  BaseUrl = '/api/student',
  StudenPage = '/api/student',
  StudentTemplate = '/api/student/template',
  StudentUpload = '/api/student/upload',
}

export function getStudentPage(params: StudentQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get({ url: Api.StudenPage, params }, { errorMessageMode });
}

export function downloadFileTemplate(errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.downloadFileByData({ url: Api.StudentTemplate }, { errorMessageMode });
}

export function getStudentDetail(stuId: string, errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.get<StudentInfoModel>({ url: Api.BaseUrl + `/${stuId}` }, { errorMessageMode });
}

export function uploadStudent(
  file: File,
  name = 'file',
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  return defHttp.uploadFile({ url: Api.StudentUpload }, { file, name }, { errorMessageMode });
}
