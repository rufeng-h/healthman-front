import { ScoreInfo } from './score';
import { SubjectModel } from './subject';
import { BasicFetchResult, BasicPageParams } from './model/baseModel';
import { defHttp } from './../utils/http/axios/index';
import { ClassModel } from './ptclass';
import { SubjectStatus } from './subject';

enum Api {
  BaseUrl = '/api/measurement',
  StuUrl = '/api/measurement/stu',
}
export const DEFAULT_MS: MeasurementDetailModel = {
  msCreated: '',
  msCreatedAdminId: '',
  msDesp: '',
  msId: 0,
  msModified: '',
  msName: '',
  msCreatedAdminName: '',
  grpName: '',
  grpId: 0,
  compStuCnt: 0,
  stuCnt: 0,
  classes: [],
  subjects: [],
};

export interface MeasurementModel {
  msId: number;
  msName: string;
  msModified?: string;
  msDesp: string;
  msCreated: string;
  grpName: string;
  grpId: number;
}

/**
 * 管理员，体测列表页
 */
export interface MeasurementInfoModel {
  msId: number;
  msName: string;
  msModified?: string;
  msDesp: string;
  msCreated: string;
  grpName: string;
  grpId: number;
  subCnt: number;
  compStuCnt: number;
  stuCnt: number;
  msCreatedAdminId: string;
  msCreatedAdminName: string;
  classes: ClassModel[];
}
/**
 * 管理员，体测详情页
 */
export interface MeasurementDetailModel {
  msId: number;
  msName: string;
  msModified?: string;
  msDesp: string;
  msCreated: string;
  grpName: string;
  grpId: number;
  compStuCnt: number;
  stuCnt: number;
  msCreatedAdminId: string;
  msCreatedAdminName: string;
  classes: ClassModel[];
  subjects: SubjectModel[];
}
/**
 * 学生，体测列表页
 */
export interface StuMeasurementDetailModel {
  msId: number;
  msName: string;
  msCreatedAdminId: string;
  msCreatedAdminName: string;
  msDesp: string;
  msCreated: string;
  subjects: SubjectStatus[];
  scores: ScoreInfo[];
}

export type MeasurementQuery = { msName?: string } & Partial<BasicPageParams>;

export function pageMeasurementInfo(params: MeasurementQuery) {
  return defHttp.get<BasicFetchResult<MeasurementInfoModel>>(
    { url: Api.BaseUrl, params },
    { errorMessageMode: 'message' },
  );
}

export function addMeasurement(data) {
  return defHttp.post({ url: Api.BaseUrl, data }, { errorMessageMode: 'message' });
}

export function delMeasurement(msId: number) {
  return defHttp.delete({ url: Api.BaseUrl + `/${msId}` }, { errorMessageMode: 'message' });
}

export function updateMeasurement(data) {
  return defHttp.put({ url: Api.BaseUrl, data }, { errorMessageMode: 'message' });
}

export function getMeasurementDetail(msId: number) {
  return defHttp.get({ url: Api.BaseUrl + `/${msId}` }, { errorMessageMode: 'message' });
}

export function pageStuMeasurementDetail(stuId: string, params: BasicPageParams) {
  return defHttp.get<BasicFetchResult<StuMeasurementDetailModel>>(
    {
      url: Api.StuUrl + `/${stuId}`,
      params,
    },
    { errorMessageMode: 'message' },
  );
}
