import { ErrorMessageMode } from './../../types/axios.d';
import { GenderEnum } from './../enums/genderEnum';
/*
 * @Author: 黄纯峰
 * @Date: 2022-03-17 18:54:37
 * @LastEditTime: 2022-03-24 18:43:35
 * @Version: 1.0
 * @Description: TODO
 */

import { defHttp } from '../utils/http/axios';

export interface SubjectModel {
  subId: number;
  subName: string;
  subDesp: string;
  subCreated: string;
  subModified: string;
}

enum Api {
  SubjectList = '/api/subject/list',
  SubjectAdd = '/api/subject',
  SubjectPage = '/api/subject',
}

export interface SubjectInfoModel {
  subId: string;
  subCreated: string;
  subName: string;
  sheetInfos: { gender: GenderEnum; grade: number };
  sbuDesp?: string;
}

export function getSubjectList(errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.get<SubjectModel[]>({ url: Api.SubjectList }, { errorMessageMode });
}

export function addSubject(data, errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.post<SubjectModel>({ url: Api.SubjectAdd, data }, { errorMessageMode });
}

export function pageSubjectInfo(params: any = {}) {
  return defHttp.get({ url: Api.SubjectPage, params }, { errorMessageMode: 'message' });
}
