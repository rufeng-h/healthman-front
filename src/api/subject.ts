import { BasicFetchResult, BasicPageParams } from './model/baseModel';
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
import { numberGradeToZhcn } from '../enums/gradeEnum';

export const EMPTY_SUB: SubjectDetailModel = {
  subCreated: '',
  subDesp: '',
  subModified: '',
  subId: 0,
  subName: '',
  levels: [],
};

/**
 * 增加是否完成，status字段
 */
export interface SubjectStatus {
  subId: number;
  subName: string;
  subCreated: string;
  subDesp: string;
  status: boolean;
}

/* 基础model */
export interface SubjectModel {
  subId: number;
  subName: string;
  subDesp: string;
  subCreated: string;
  subModified: string;
  compId?: number;
}

enum Api {
  BaseUrl = '/api/subject',
  SubjectPage = '/api/subject',
}

/* 包含评分标准 */
export interface SubjectDetailModel extends SubjectModel {
  levels: string[];
  compName?: string;
}

/* 包含运动能力 */
export interface SubjectInfoModel extends SubjectModel {
  compId: number;
  compName: string;
  subStudents: { gender: GenderEnum; grade: number }[];
  hasScore: boolean;

  /* afterFetch */
  msInfos: MsInfo[];
}

export interface SubjectQuery extends BasicPageParams {
  subName?: string;
}

interface MsInfo {
  name: string;
  value: { grade: string; M: boolean; F: boolean }[];
}

export function getSubjectDetail(subId: number): Promise<SubjectDetailModel> {
  return defHttp.get<SubjectDetailModel>(
    { url: Api.BaseUrl + `/${subId}` },
    { errorMessageMode: 'message' },
  );
}

export function addSubject(data, errorMessageMode: ErrorMessageMode = 'message'): Promise<boolean> {
  return defHttp.post<boolean>({ url: Api.BaseUrl, data }, { errorMessageMode });
}

export function updateSubject(data): Promise<boolean> {
  return defHttp.put<boolean>({ url: Api.BaseUrl, data }, { errorMessageMode: 'message' });
}

export async function pageSubjectInfo(
  params: SubjectQuery,
): Promise<BasicFetchResult<SubjectInfoModel>> {
  const data = await defHttp.get<BasicFetchResult<SubjectInfoModel>>(
    { url: Api.SubjectPage, params },
    { errorMessageMode: 'message' },
  );
  data.items.forEach((item) => {
    if (!item.subStudents) {
      return;
    }
    const msInfos: MsInfo[] = [
      { name: '小学', value: [] },
      { name: '初中', value: [] },
      { name: '高中', value: [] },
      { name: '大学', value: [] },
    ];
    const mappings: any = {};
    item.subStudents.forEach((sh) => {
      if (mappings[sh.grade] === undefined) {
        mappings[sh.grade] = {};
      }
      mappings[sh.grade][sh.gender] = true;
    });
    for (const g in mappings) {
      const grade = parseInt(g);
      const ms = {
        grade: numberGradeToZhcn(grade),
        M: mappings[grade]['M'],
        F: mappings[grade]['F'],
      };
      if (grade <= 6) {
        msInfos[0].value.push(ms);
      } else if (grade <= 9) {
        msInfos[1].value.push(ms);
      } else if (grade <= 12) {
        msInfos[2].value.push(ms);
      } else {
        msInfos[3].value.push(ms);
      }
    }
    item.msInfos = msInfos.filter((m) => m.value.length !== 0);
  });
  return Promise.resolve(data);
}

export function deleteSubject(subId: number) {
  return defHttp.delete<boolean>(
    { url: Api.BaseUrl + `/${subId}` },
    { errorMessageMode: 'message' },
  );
}
