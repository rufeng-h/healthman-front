import { BasicColumn } from '/@/components/Table/index';
import { defHttp } from './../utils/http/axios/index';

enum Path {
  BasePath = '/api/oper',
  List = '/api/oper/list',
}

export interface OperationModel {
  operId: number;
  operName: string;
  operDesp: string;
  operCreated: string;
  operSummary: string;
  pid: number;
}

export const operColumns: BasicColumn[] = [
  {
    dataIndex: 'operSummary',
    title: '模块',
    width: 100,
  },
  {
    dataIndex: 'sons',
    title: '权限',
    slots: { customRender: 'sons' },
  },
];

export async function listOper() {
  return defHttp.get<OperationModel[]>({ url: Path.List }, { errorMessageMode: 'message' });
}
