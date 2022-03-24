import { BasicColumn } from '../components/Table/src/types/table';
import { TreeItem } from '../components/Tree';
import { ContentTypeEnum } from '../enums/httpEnum';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
/*
 * @Author: 黄纯峰
 * @Date: 2022-03-12 17:41:02
 * @LastEditTime: 2022-03-24 11:52:01
 * @Version: 1.0
 * @Description: TODO
 */

enum Api {
  ClassPage = '/api/class',
  ClassTree = '/api/class/tree',
  ClassList = '/api/class/list',
  GradeList = '/api/class/grade/list',
  ClassTemplate = '/api/class/template',
  ClassUpload = '/api/class/upload',
}

export interface ClassQuery {
  clsCode?: string;
  clsName?: string;
  clgCode?: string;
  grade?: number;
}

export interface ClassInfoModel {
  clsId: number;
  clsCode: string;
  clsName: string;
  clgCode?: string;
  clgName?: string;
  clsEntryYear: number;
  clsCreated: string;
  stuCount: number;
}

export const classColumns: BasicColumn[] = [
  {
    dataIndex: 'clsCode',
    title: '代码',
    fixed: 'left',
    width: 100,
    slots: { customRender: 'code' },
  },
  {
    dataIndex: 'clsName',
    title: '班级',
    width: 200,
  },
  {
    dataIndex: 'clgCode',
    title: '学院代码',
  },
  {
    dataIndex: 'clgName',
    title: '学院',
    width: 150,
  },
  {
    dataIndex: 'clsEntryYear',
    title: '年级',
  },
  {
    dataIndex: 'stuCount',
    title: '班级人数',
  },
  {
    dataIndex: 'clsCreated',
    title: '创建时间',
  },
];

export function getGradeList(params: ClassQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<number[]>({ url: Api.GradeList, params }, { errorMessageMode });
}

export function getClassPage(query: ClassQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<ClassInfoModel[]>({ url: Api.ClassPage, params: query }, { errorMessageMode });
}

export function getClassTree(
  params: { collegeId: number | string },
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  return defHttp.get<TreeItem[]>({ url: Api.ClassTree, params }, { errorMessageMode });
}

export function getClassList(params: ClassQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<ClassInfoModel[]>({ url: Api.ClassList, params }, { errorMessageMode });
}

export function downloadFileTemplate(
  params: any = {},
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  return defHttp.downloadFileByData({ url: Api.ClassTemplate, params }, { errorMessageMode });
}

export function uploadClass(
  file: File,
  name = 'file',
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  const formData = new window.FormData();
  formData.append(name, file);
  return defHttp.post<number>(
    {
      url: Api.ClassUpload,
      data: formData,
      headers: { 'Content-type': ContentTypeEnum.FORM_DATA },
    },
    { errorMessageMode },
  );
}
