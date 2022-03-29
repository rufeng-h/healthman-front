import { defHttp } from './../utils/http/axios/index';
import { ErrorMessageMode } from './../../types/axios.d';
enum Api {
  SubGroupList = '/api/subGroup/list',
  SubGroupAdd = '/api/subGroup',
  PageSubGroup = '/api/subGroup',
}

export interface SubGroupQuery {
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
  createdAdminId: string;
  createdAdminName: string;
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
