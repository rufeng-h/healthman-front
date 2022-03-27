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
  gender: 'M' | 'F' | undefined;
  grade: number;
  upper: number;
  lower: number;
  score: number;
  createdTime: string;
  level: string;
  text?: string;
}

export const scoreSheetColumns: BasicColumn[] = [
  {
    dataIndex: 'text',
    title: '标准',
  },
  {
    dataIndex: 'score',
    title: '分数',
  },
  {
    title: '等级',
    dataIndex: 'level',
    slots: { customRender: 'level' },
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
