import { defHttp } from './../utils/http/axios/index';
import { ErrorMessageMode } from './../../types/axios.d';
enum Api {
  SubGroupList = '/api/subGroup/list',
  SubGroupAdd = '/api/subGroup',
}

export interface SubGroupFormdata {
  grpName: string;
  grpDesp: string;
  subIds: number[];
}

export function getSubGroupList(errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.get({ url: Api.SubGroupList }, { errorMessageMode });
}

export function addSubGroup(data: SubGroupFormdata) {
  return defHttp.post({ url: Api.SubGroupAdd, data }, { errorMessageMode: 'message' });
}
