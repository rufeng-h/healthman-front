import { BasicColumn } from '../components/Table';
import { defHttp } from '../utils/http/axios';
import { ErrorMessageMode } from '/#/axios';

/*
 * @Author: 黄纯峰
 * @Date: 2022-03-17 18:18:13
 * @LastEditTime: 2022-03-17 21:15:11
 * @Version: 1.0
 * @Description: TODO
 */
export interface ScoreSheetModel {
  subjectId: number;
  gender: 'M' | 'F' | undefined;
  grade: number;
  upper: number;
  lower: number;
  score: number;
  createdTime: string;
  level: string;
}

export const scoreSheetColumns: BasicColumn[] = [
  {
    title: '上区间',
    dataIndex: 'upper',
  },
  {
    title: '下区间',
    dataIndex: 'lower',
  },
  {
    dataIndex: 'score',
    title: '分数',
  },
  {
    title: '等级',
    dataIndex: 'level',
  },
  {
    title: '性别',
    dataIndex: 'gender',
  },
];

export type ScoreSheetQuery = Partial<ScoreSheetModel>;

enum Api {
  ScoreSheetList = '/scoreSheet/list',
}

export function getScoreSheetList(
  params: ScoreSheetQuery,
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  return defHttp.get<ScoreSheetModel>({ params, url: Api.ScoreSheetList }, { errorMessageMode });
}
