import { usePermission } from '/@/hooks/web/usePermission';
import { PtRole } from '../store/modules/Authority';
import { calcColWidth } from '../utils/actionCol';
import { BasicColumn } from './../components/Table/src/types/table';
import { OperationModel } from './operation';
import { defHttp } from '/@/utils/http/axios';

const authorities = [PtRole.roleUpdate, PtRole.roleDelete];

const { hasAnyAuthority } = usePermission();

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
    dataIndex: 'roleDesp',
    title: '备注',
  },
  {
    dataIndex: 'roleCreated',
    title: '创建时间',
  },
  {
    dataIndex: 'status',
    title: '状态',
    slots: { customRender: 'status' },
  },
  {
    title: '操作',
    dataIndex: '',
    slots: { customRender: 'action' },
    width: calcColWidth(authorities),
    ifShow: () => hasAnyAuthority(authorities),
  },
];

export interface PtRoleFormdata {
  roleId?: number;
  status?: boolean;
  roleName: string;
  roleDesp: string;
  operIds: string[];
}

export function pageRole() {
  return defHttp.get({ url: Path.BasePath }, { errorMessageMode: 'message' });
}

export function addRole(data: PtRoleFormdata) {
  return defHttp.post<boolean>(
    { url: Path.BasePath, data },
    {
      errorMessageMode: 'message',
    },
  );
}

export function updateRole(data: PtRoleFormdata) {
  return defHttp.put<boolean>({ url: Path.BasePath, data }, { errorMessageMode: 'message' });
}

export function deleteRole(roleId: number) {
  return defHttp.delete<boolean>(
    { url: Path.BasePath + `/${roleId}` },
    { errorMessageMode: 'message' },
  );
}
