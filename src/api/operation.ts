import { defHttp } from './../utils/http/axios/index';

enum Path {
  BasePath = '/api/oper',
}

export interface OperationModel {
  operId: string;
  operSummary: string;
}

export function listOper() {
  return defHttp.get<OperationModel[]>({ url: Path.BasePath }, { errorMessageMode: 'message' });
}
