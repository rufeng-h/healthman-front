import { STUDENT_DELETE, STUDENT_GET } from './../store/modules/Authority';
import { usePermission } from '/@/hooks/web/usePermission';
import { GenderEnum } from '../enums/genderEnum';
import { defHttp } from '../utils/http/axios';
import { QueryOrder } from './common';
import { MeasurementModel } from './measurement';
import { ErrorMessageMode } from '/#/axios';
import { BasicColumn } from '/@/components/Table';
import { calcColWidth } from '../utils/actionCol';

/*
 * @Author: 黄纯峰
 * @Date: 2022-03-13 20:33:26
 * @LastEditTime: 2022-03-24 18:21:43
 * @Version: 1.0
 * @Description: TODO
 */

const { hasAnyAuthority } = usePermission();
const authorities = [STUDENT_DELETE, STUDENT_GET];

export interface StudentInfoModel {
  sid: number;
  stuId: string;
  stuName: string;
  stuBirth: string;
  stuGender: GenderEnum | undefined;
  avatar: string;
  clsCode: string;
  clsName: string;
  stuLastLogin: string;
  stuCreated: string;
  stuDesp: string;
  clgCode?: string;
  clgName?: string;
}

export interface StuMeasurementInfoModel extends StudentInfoModel {
  msStatus: (MeasurementModel & { status: boolean })[];
}

export const DEFAULT_STU: StuMeasurementInfoModel = {
  sid: 0,
  stuId: '',
  stuName: '',
  stuBirth: '',
  avatar: '',
  clsCode: '',
  clsName: '',
  stuLastLogin: '',
  stuCreated: '',
  stuDesp: '',
  clgCode: undefined,
  stuGender: undefined,
  clgName: undefined,
  msStatus: [],
};

export interface StudentQuery extends QueryOrder {
  stuId?: string;
  stuName?: string;
  stuGender?: GenderEnum;
  clsCode?: string;
}

export interface StudentUpdateFormdata {
  stuId: string;
  avatar: string;
  desp: string;
  birth: string;
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
  {
    title: '操作',
    width: calcColWidth(authorities),
    slots: { customRender: 'action' },
    fixed: 'right',
    ifShow: () => hasAnyAuthority(authorities),
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

export function getStudentInfo(stuId: string, errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.get<StuMeasurementInfoModel>(
    { url: Api.BaseUrl + `/${stuId}` },
    { errorMessageMode },
  );
}

export function uploadStudent(
  file: File,
  name = 'file',
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  return defHttp.uploadFile({ url: Api.StudentUpload }, { file, name }, { errorMessageMode });
}

export function updateStudent(data: StudentUpdateFormdata) {
  return defHttp.put<boolean>({ url: Api.BaseUrl, data }, { errorMessageMode: 'message' });
}

export function deleteStudent(stuId: string) {
  return defHttp.delete<boolean>(
    { url: Api.BaseUrl + `/${stuId}` },
    { errorMessageMode: 'message' },
  );
}
