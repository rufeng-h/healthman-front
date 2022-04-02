import { BasicColumn } from '../components/Table/src/types/table';
import { TreeItem } from '../components/Tree';
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

/* 获取年级 */
export function getGradeList(params: ClassQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<number[]>({ url: Api.GradeList, params }, { errorMessageMode });
}

/* 班级详情 */
export function getClassPage(query: ClassQuery, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<BasicFetchResult<ClassInfoModel>>(
    { url: Api.ClassPage, params: query },
    { errorMessageMode },
  );
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

export function downloadFileTemplate(
  params: any = {},
  errorMessageMode: ErrorMessageMode = 'message',
) {
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
