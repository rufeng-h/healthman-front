import { BasicFetchResult, BasicPageParams } from './model/baseModel';
import { defHttp } from './../utils/http/axios/index';

enum Api {
  BaseUrl = '/api/measurement',
}

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
  clsCnt: number;
  msCreatedAdminId: string;
  msCreatedAdminName: string;
  classes: { clsCode: string; clsName: string }[];
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
