import { BasicColumn } from '/@/components/Table';
import { TreeItem } from '../components/Tree';
import { numberGradeToZhcn } from '../enums/gradeEnum';
import { BasicFetchResult } from './model/baseModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
/*
 * @Author: 黄纯峰
 * @Date: 2022-03-12 17:41:02
 * @LastEditTime: 2022-03-24 17:14:39
 * @Version: 1.0
 * @Description: TODO
 */

enum Api {
  BaseUrl = '/api/class',
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

export interface ClassModel {
  clsId: number;
  clsCode: string;
  clsName: string;
  clgCode?: string;
  clsEntryYear: number;
  clsCreated: string;
}

export interface UpdatePtClassFormdata {
  clsCode: string;
  clgCode?: string;
  clsName: string;
  teaId: string;
}

export interface ClassInfoModel {
  clsId: number;
  clsCode: string;
  clsName: string;
  clgCode?: string;
  clgName?: string;
  teaName: string;
  clsEntryYear: number;
  clsEntryGrade: number;
  clsCreated: string;
  clsModified: string;
  stuCount: number;

  /**
   * 前端计算
   */
  gradeZhcn: string;
}

export const classColumns: BasicColumn[] = [
  {
    dataIndex: 'clsCode',
    title: '代码',
    width: 100,
    slots: { customRender: 'code' },
  },
  {
    dataIndex: 'clsName',
    title: '班级',
    width: 200,
  },
  {
    dataIndex: 'clgName',
    title: '学院',
    width: 150,
  },
  {
    dataIndex: 'teaName',
    title: '教师',
    width: 100,
  },
  {
    title: '年级',
    dataIndex: 'gradeZhcn',
  },
  {
    dataIndex: 'stuCount',
    title: '班级人数',
  },
  {
    dataIndex: 'clsModified',
    title: '上次修改',
  },
  {
    dataIndex: 'clsCreated',
    title: '创建时间',
  },
  {
    title: '操作',
    width: 150,
    slots: { customRender: 'action' },
  },
];

/* 获取年级 */
export function getGradeList(
  clgCode: string | undefined = undefined,
  errorMessageMode: ErrorMessageMode = 'message',
) {
  return defHttp.get<number[]>({ url: Api.GradeList, params: { clgCode } }, { errorMessageMode });
}

/* 班级详情 */
export async function getClassPage(
  query: ClassQuery,
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  const data = await defHttp.get<BasicFetchResult<ClassInfoModel>>(
    { url: Api.ClassPage, params: query },
    { errorMessageMode },
  );
  const year = new Date().getFullYear();
  data.items.forEach((cls) => {
    cls.gradeZhcn = numberGradeToZhcn(year - cls.clsEntryYear + cls.clsEntryGrade);
  });
  return Promise.resolve(data);
}

/*  */
export function getClassTree(
  params: { collegeId: number | string },
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  return defHttp.get<TreeItem[]>({ url: Api.ClassTree, params }, { errorMessageMode });
}

/* 班级列表 */
export function getClassList(params: ClassQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<ClassInfoModel[]>({ url: Api.ClassList, params }, { errorMessageMode });
}

export function downloadTemplate(params: any = {}, errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.downloadFileByData({ url: Api.ClassTemplate, params }, { errorMessageMode });
}

/* 详情页接口 */
export function getClassDetail(clsCode: string, errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.get<ClassInfoModel>({ url: Api.BaseUrl + `/${clsCode}` }, { errorMessageMode });
}

export function uploadClass(
  file: File,
  clgCode: string | undefined = undefined,
  name = 'file',
  errorMessageMode: ErrorMessageMode = 'message',
): Promise<number> {
  return defHttp.uploadFile(
    { url: Api.ClassUpload, params: { clgCode } },
    { file, name },
    { errorMessageMode },
  );
}

export function deletePtClass(clsCode: string) {
  return defHttp.delete<boolean>(
    {
      url: Api.BaseUrl + `/${clsCode}`,
    },
    { errorMessageMode: 'message' },
  );
}

export function updatePtClass(data: UpdatePtClassFormdata) {
  return defHttp.put<boolean>({ url: Api.BaseUrl, data }, { errorMessageMode: 'message' });
}
