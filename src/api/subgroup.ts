import { BasicPageParams } from './model/baseModel';
import { defHttp } from './../utils/http/axios/index';
import { ErrorMessageMode } from './../../types/axios.d';
enum Api {
  BaseUrl = '/api/subGroup',
  SubGroupList = '/api/subGroup/list',
  SubGroupAdd = '/api/subGroup',
  PageSubGroup = '/api/subGroup',
}

export interface SubGroupQuery extends BasicPageParams {
  grpName?: string;
}
export interface SubGroupFormdata {
  grpName: string;
  grpDesp: string;
  subIds: number[];
}

export interface SubGroupInfoModel {
  grpName: string;
  grpId: number;
  grpModified?: string;
  grpCreated: string;
  grpDesp: string;
  subjects: { subName: string; subId: number }[];
  grpCreatedAdminId: string;
  grpCreatedAdminName: string;
}

export function getSubGroupList(errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.get({ url: Api.SubGroupList }, { errorMessageMode });
}

export function addSubGroup(data: SubGroupFormdata) {
  return defHttp.post({ url: Api.SubGroupAdd, data }, { errorMessageMode: 'message' });
}

export function pageSubGroupInfo(params: any = {}) {
  return defHttp.get({ url: Api.PageSubGroup, params }, { errorMessageMode: 'message' });
}

export function delSubGrp(grpId: number) {
  return defHttp.delete<Boolean>(
    { url: Api.BaseUrl + `/${grpId}` },
    { errorMessageMode: 'message' },
  );
}
