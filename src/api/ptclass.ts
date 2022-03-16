import { BasicColumn } from '../components/Table/src/types/table';
import { TreeItem } from '../components/Tree';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
/*
 * @Author: 黄纯峰
 * @Date: 2022-03-12 17:41:02
 * @LastEditTime: 2022-03-16 16:19:49
 * @Version: 1.0
 * @Description: TODO
 */

enum Api {
  ClassPage = '/api/class',
  ClassTree = '/api/class/tree',
  ClassList = '/api/class/list',
}

export interface ClassModel {
  code: string;
  name: string;
  collegeId: number;
  collegeName: string;
  majorCode: string;
  majorName: string;
  grade: number;
  createdTime: string;
}

export const classColumns: BasicColumn[] = [
  {
    dataIndex: 'code',
    title: '代码',
    fixed: 'left',
    width: 100,
    slots: { customRender: 'code' },
  },
  {
    dataIndex: 'name',
    title: '班级',
    width: 200,
  },
  {
    dataIndex: 'collegeName',
    title: '学院',
    width: 150,
  },
  {
    title: '专业',
    dataIndex: 'majorName',
    width: 200,
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: 200,
  },
  // {
  //   title: '学院网址',
  //   dataIndex: 'home',
  //   slots: { customRender: 'home' },
  //   width: 80,
  // },
];

export type ClassQuery = Partial<ClassModel>;

export function getClassPage(query: ClassQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<ClassModel>({ url: Api.ClassPage, params: query }, { errorMessageMode });
}

export function getClassTree(
  params: { collegeId: number | string },
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  return defHttp.get<TreeItem[]>({ url: Api.ClassTree, params }, { errorMessageMode });
}

export function getClassList(params: ClassQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<ClassModel>({ url: Api.ClassList, params }, { errorMessageMode });
}
