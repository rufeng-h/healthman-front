import { SubjectModel } from './subject';
import { BasicFetchResult, BasicPageParams } from './model/baseModel';
import { defHttp } from './../utils/http/axios/index';
import { ClassModel } from './ptclass';

enum Api {
  BaseUrl = '/api/measurement',
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
  return defHttp.delete({ url: Api.BaseUrl, params: { msId } }, { errorMessageMode: 'message' });
}

export function updateMeasurement(data) {
  return defHttp.put({ url: Api.BaseUrl, data }, { errorMessageMode: 'message' });
}

export function getMeasurementDetail(msId: number) {
  return defHttp.get({ url: Api.BaseUrl + `/${msId}` }, { errorMessageMode: 'message' });
}
