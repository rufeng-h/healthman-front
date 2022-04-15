import { BasicFetchResult } from '/@/api/model/baseModel';
import { GenderEnum } from '/@/enums/genderEnum';
import { defHttp } from './../utils/http/axios/index';
import { BasicColumn } from '../components/Table';
enum Api {
  BaseUrl = '/api/score',
  UploadScore = '/api/score/upload',
  DownloadScore = '/api/score/download',
  PageMsScore = '/api/score/ms',
  PageStuScore = '/api/score/stu',
}

export type ScoreQuery = {
  msId?: number;
  stuId?: number;
  subId?: number;
} & {
  page?: number;
  pageSize?: number;
};

export interface ScoreInfo {
  subId: number;
  subName: string;
  scoId: number;
  scoData: number;
  scoCreated: string;
  scoLevel?: string;
  score?: number;
}

export interface ScoreRecord {
  scoId: number;
  subName: string;
  scoData: number;
  scoCreated: string;
  scoLevel?: string;
  score?: number;
  stuId: string;
  stuGender: GenderEnum;
  stuName: string;
  rowSpan: number;
}

export interface StuScoreInfo {
  stuId: string;
  stuGender: GenderEnum;
  stuName: string;
  scores: ScoreInfo[];
}

export const scoreColumns: BasicColumn[] = [
  // {
  //   title: '学号',
  //   dataIndex: 'stuId',
  //   customRender: ({ text, record }) => {
  //     const obj = {
  //       children: text,
  //       props: {} as any,
  //     };
  //     obj.props.rowSpan = record.rowSpan;
  //     return obj;
  //   },
  // },
  // {
  //   title: '姓名',
  //   dataIndex: 'stuName',
  //   customRender: ({ text, record }) => {
  //     const obj = {
  //       children: text,
  //       props: {} as any,
  //     };
  //     obj.props.rowSpan = record.rowSpan;
  //     return obj;
  //   },
  // },
  // {
  //   title: '性别',
  //   dataIndex: 'stuGender',
  //   slots: { customRender: 'stuGender' },
  //   customRender: ({ text, record }) => {
  //     const obj = {
  //       children: text,
  //       props: {} as any,
  //     };
  //     obj.props.rowSpan = record.rowSpan;
  //     return obj;
  //   },
  // },
  {
    title: '科目',
    dataIndex: 'subName',
  },
  {
    title: '数据',
    dataIndex: 'scoData',
  },
  {
    title: '成绩',
    dataIndex: 'score',
  },
  {
    title: '等级',
    dataIndex: 'scoLevel',
  },
  {
    title: '测试时间',
    dataIndex: 'scoCreated',
  },
];

export function uploadScore(file: File, msId: number | undefined, name = 'file'): Promise<number> {
  return defHttp.uploadFile(
    { url: Api.UploadScore + `/${msId}` },
    { file, name },
    { errorMessageMode: 'message' },
  );
}

export function pageMsScore(params: ScoreQuery = {}): Promise<BasicFetchResult<StuScoreInfo>> {
  return defHttp.get<BasicFetchResult<StuScoreInfo>>(
    { url: Api.PageMsScore, params },
    { errorMessageMode: 'message' },
  );
}

export function downloadScore(params: ScoreQuery = {}) {
  return defHttp.downloadFileByData(
    { url: Api.DownloadScore, params },
    { errorMessageMode: 'message' },
  );
}
// const data = await defHttp.get<StuScoreInfo[]>(
//   { url: Api.BaseUrl, params },
//   { errorMessageMode: 'message' },
// );
// const stuIds = new Set();
// const records: ScoreRecord[] = [];
// data.forEach((info) => {
//   info.scores.forEach((score) => {
//     //@ts-ignore
//     const record: ScoreRecord = {
//       stuId: info.stuId,
//       stuName: info.stuName,
//       stuGender: info.stuGender,
//     };
//     if (stuIds.has(info.stuId)) {
//       record.rowSpan = 0;
//     } else {
//       stuIds.add(info.stuId);
//       record.rowSpan = info.scores.length;
//     }
//     Object.assign(record, score);
//     records.push(record);
//   });
// });
// console.log(records);

// return new Promise((resolve) => resolve(records));
