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
import { gradeMappings, numberGradeToZhcn } from '../enums/gradeEnum';

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
}

enum Api {
  SubjectList = '/api/subject/list',
  SubjectAdd = '/api/subject',
  SubjectPage = '/api/subject',
}

/* 包含评分标准 */
export interface SubjectDetailModel {
  subId: string;
  subCreated: string;
  subName: string;
  sheetInfos: { gender: GenderEnum; grade: number };
  sbuDesp?: string;
}

/* 包含运动能力 */
export interface SubjectInfoModel extends SubjectModel {
  compId: number;
  compName: string;
  sheetInfos: { gender: GenderEnum; grade: number }[];

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

export function getSubjectList(errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.get<SubjectModel[]>({ url: Api.SubjectList }, { errorMessageMode });
}

export function addSubject(data, errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.post<SubjectModel>({ url: Api.SubjectAdd, data }, { errorMessageMode });
}

export async function pageSubjectInfo(
  params: SubjectQuery,
): Promise<BasicFetchResult<SubjectInfoModel>> {
  const data = await defHttp.get<BasicFetchResult<SubjectInfoModel>>(
    { url: Api.SubjectPage, params },
    { errorMessageMode: 'message' },
  );
  data.items.forEach((item) => {
    const msInfos: MsInfo[] = [
      { name: '小学', value: [] },
      { name: '初中', value: [] },
      { name: '高中', value: [] },
      { name: '大学', value: [] },
    ];
    const mappings: any = {};
    for (const grade in gradeMappings) {
      mappings[grade] = {};
      mappings[grade]['M'] = false;
      mappings[grade]['F'] = false;
    }
    item.sheetInfos.forEach((sh) => {
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
  console.log(data);
  return Promise.resolve(data);
}
