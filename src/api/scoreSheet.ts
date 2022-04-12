import { numberGradeToZhcn } from './../enums/gradeEnum';
import { GenderEnum } from './../enums/genderEnum';
import { BasicPageParams } from './model/baseModel';
import { BasicColumn } from '../components/Table';
import { defHttp } from '../utils/http/axios';
import { ErrorMessageMode } from '/#/axios';

/*
 * @Author: 黄纯峰
 * @Date: 2022-03-17 18:18:13
 * @LastEditTime: 2022-03-25 12:41:41
 * @Version: 1.0
 * @Description: TODO
 */

export const SCORE_SHEET_MAX = 9999;
export const SCORE_SHEET_MIN = -9999;

export interface ScoreSheetModel {
  id: number;
  subId: number;
  gender: 'M' | 'F';
  grade: number;
  upper: number | undefined;
  lower: number | undefined;
  score: number | undefined;
  createdTime: string;
  level: string;

  /**
   *
   */
  key: string;
}

export const scoreSheetColumns: BasicColumn[] = [
  {
    title: '年级',
    dataIndex: 'grade',
    width: 100,
    customRender({ text }) {
      return numberGradeToZhcn(text);
    },
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 80,
    slots: { customRender: 'gender' },
  },
  {
    dataIndex: 'lower',
    title: '下限',
    editRow: true,
    width: 100,
    editComponentProps: {
      min: 0,
    },
    editValueMap(value) {
      return value ? value.toString() : '-';
    },
    editComponent: 'InputNumber',
    // editRule: true,
  },
  {
    dataIndex: 'upper',
    title: '上限',
    width: 100,

    editRow: true,
    editComponent: 'InputNumber',
    editComponentProps: {
      min: 0,
    },
    editValueMap(value) {
      return value ? value.toString() : '-';
    },
  },
  {
    dataIndex: 'score',
    width: 100,
    title: '分数',
    editComponent: 'InputNumber',
    // editRule: true,
    editRow: true,
    editComponentProps: {
      min: 0,
    },
    editValueMap(value) {
      return value ? value.toString() : '-';
    },
  },
  {
    dataIndex: 'level',
    width: 100,
    title: '等级',
    editComponent: 'Select',
    editComponentProps: {
      options: [],
      placeholder: '请选择',
      showSearch: true,
    },
    editRow: true,
    // editRule: true,
    editValueMap(value) {
      return value ? value.toString() : '-';
    },
  },
  {
    dataIndex: 'action',
    title: '操作',
    slots: { customRender: 'action' },
    width: 100,
  },
];

export interface ScoreSheetQuery extends BasicPageParams {
  gender?: GenderEnum;
  grade?: number;
  subId: number;
}

enum Api {
  BaseUrl = '/scoreSheet',
  UploadScoreSheet = '/scoreSheet/upload',
}

export function pageScoreSheet(
  params: ScoreSheetQuery,
  errorMessageMode: ErrorMessageMode = 'message',
) {
  return defHttp.get<ScoreSheetModel[]>({ params, url: Api.BaseUrl }, { errorMessageMode });
}

export function uploadScoreSheet(subId: number, file: File): Promise<number> {
  return defHttp.uploadFile(
    { url: Api.UploadScoreSheet, params: { subId } },
    { file },
    { errorMessageMode: 'message' },
  );
}
