import { defHttp } from '../utils/http/axios';
import { QueryOrder } from './base';
import { ErrorMessageMode } from '/#/axios';
import { BasicColumn } from '/@/components/Table';

/*
 * @Author: 黄纯峰
 * @Date: 2022-03-13 20:33:26
 * @LastEditTime: 2022-03-16 16:02:39
 * @Version: 1.0
 * @Description: TODO
 */
export interface StudentModel {
  number: number;
  name: string;
  birthday: string;
  gender: 'M' | 'F';
  avatar: string;
  collegeId: number;
  majorCode: string;
  classCode: string;
  lastLoginTime: string;
  createdTime: string;
  desp: string;
  phone: string;
  email: string;
}

export type StudentQuery = Partial<StudentModel> & QueryOrder;

export const studentColumns: BasicColumn[] = [
  {
    title: '学号',
    dataIndex: 'number',
    slots: { customRender: 'number' },
    sorter: true,
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '性别',
    dataIndex: 'gender',
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
    onFilter: (value, record) => value === record.gender,
  },
  {
    title: '出生日期',
    dataIndex: 'birthday',
    sorter: true,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    slots: { customRender: 'avatar' },
  },
];

enum Api {
  StudenPage = '/api/student',
}

export function getStudentPage(params: StudentQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get({ url: Api.StudenPage, params }, { errorMessageMode });
}
