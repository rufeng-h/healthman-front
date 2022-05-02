import { BasicPageParams, BasicFetchResult } from './model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
enum Api {
  BaseUrl = '/api/subGroup',
  Share = '/api/subGroup/share',
  SubGroupList = '/api/subGroup/list',
  SubGroupAdd = '/api/subGroup',
  PageSubGroup = '/api/subGroup',
  DelSubFromGrp = '/api/subGroup/sub',
}

export interface SubGroupQuery extends BasicPageParams {
  grpName?: string;
  self?: boolean;
}
export interface SubGroupFormdata {
  grpName: string;
  grpDesp: string;
  subIds: number[];
}

export interface SubGroupShareFormdata {
  grpId: number;
  teaIds: string[];
}

export interface SubGroupInfoModel {
  grpName: string;
  grpId: number;
  grpModified?: string;
  grpCreated: string;
  grpDesp: string;
  subjects: { subName: string; subId: number }[];
  grpCreatedTeaId: string;
  grpCreatedTeaName: string;

  shareTime?: string;
  shared: boolean;
  sharedTeaIds?: string[];
}

export function getSubGroupList(errorMessageMode: ErrorMessageMode = 'message') {
  return defHttp.get({ url: Api.SubGroupList }, { errorMessageMode });
}

export function addSubGroup(data: SubGroupFormdata) {
  return defHttp.post({ url: Api.SubGroupAdd, data }, { errorMessageMode: 'message' });
}

export async function pageSubGroupInfo(params: any = {}) {
  const data = await defHttp.get<BasicFetchResult<SubGroupInfoModel>>(
    { url: Api.PageSubGroup, params },
    { errorMessageMode: 'message' },
  );
  data.items.forEach((item) => {
    item.shared = !!item.shareTime;
  });
  return Promise.resolve(data);
}

/**
 * 从科目组中删除科目
 */
export function delSubFromGrp(subGrpId: number, subId: number) {
  return defHttp.delete<boolean>(
    { url: Api.BaseUrl + `/${subGrpId}/${subId}` },
    { errorMessageMode: 'message' },
  );
}

export function delSubGrp(grpId: number) {
  return defHttp.delete<Boolean>(
    { url: Api.BaseUrl + `/${grpId}` },
    { errorMessageMode: 'message' },
  );
}

export function shareSubGrp(data: SubGroupShareFormdata) {
  return defHttp.post<boolean>({ url: Api.Share, data }, { errorMessageMode: 'message' });
}
