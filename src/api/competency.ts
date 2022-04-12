import { defHttp } from '/@/utils/http/axios';
enum Api {
  BaseUrl = '/api/comp',
  CompList = '/api/comp/list',
}

export interface CompetencyModel {
  compId: number;
  compName: string;
  compDesp: string;
  compModified?: string;
  compCreated: string;
}

export function listCompetency() {
  return defHttp.get({ url: Api.CompList }, { errorMessageMode: 'message' });
}
