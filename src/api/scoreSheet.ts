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
  subjectId: number;
  gender: 'M' | 'F';
  grade: number;
  upper: number | undefined;
  lower: number | undefined;
  score: number | undefined;
  createdTime: string;
  level: string;
  text?: string;
}

export const scoreSheetColumns: BasicColumn[] = [
  {
    dataIndex: 'lower',
    title: '下限',
    editRow: true,
    editComponentProps: {
      min: 0,
    },
    editValueMap(value) {
      return value.toString();
    },
    editComponent: 'InputNumber',
    editRule: true,
  },
  {
    dataIndex: 'upper',
    title: '上限',
    editRow: true,
    editComponent: 'InputNumber',
    editComponentProps: {
      min: 0,
    },
    editValueMap(value) {
      return value.toString();
    },
  },
  {
    dataIndex: 'score',
    title: '分数',
    editComponent: 'InputNumber',
    editRule: true,
    editRow: true,
    editComponentProps: {
      min: 0,
    },
    editValueMap(value) {
      return value.toString();
    },
  },
  {
    dataIndex: 'level',
    title: '等级',
    editComponent: 'Select',
    editComponentProps: {
      options: [],
      placeholder: '请选择',
      showSearch: true,
    },
    editRow: true,
    editRule: true,
  },
  {
    dataIndex: 'action',
    title: '操作',
    slots: { customRender: 'action' },
    width: 100,
  },
];

export type ScoreSheetQuery = Partial<ScoreSheetModel>;

enum Api {
  ScoreSheetList = '/scoreSheet/list',
}

export function getScoreSheetList(
  params: ScoreSheetQuery,
  errorMessageMode: ErrorMessageMode = 'message',
) {
  return defHttp.get<ScoreSheetModel[]>({ params, url: Api.ScoreSheetList }, { errorMessageMode });
}
