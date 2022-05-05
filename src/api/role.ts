import { BasicColumn } from './../components/Table/src/types/table';
import { OperationModel } from './operation';
import { defHttp } from '/@/utils/http/axios';
enum Path {
  BasePath = '/api/role',
}

export interface RoleInfoModel {
  roleId: number;
  roleName: string;
  roleCreated: string;
  roleModified: string;
  roleDesp: string;
  status: boolean;
  operations: OperationModel[];
}

export const roleColumns: BasicColumn[] = [
  {
    dataIndex: 'roleName',
    title: '角色',
  },
  {
    dataIndex: 'status',
    title: '状态',
    slots: { customRender: 'status' },
  },
  {
    dataIndex: 'roleCreated',
    title: '创建时间',
  },
];

export interface PtRoleFormdata {
  roleName: string;
}

export function pageRole() {
  return defHttp.get({ url: Path.BasePath }, { errorMessageMode: 'message' });
}
