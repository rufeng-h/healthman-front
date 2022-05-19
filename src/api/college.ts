import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { BasicColumn } from '/@/components/Table';
import { TreeItem } from '../components/Tree';
import { usePermission } from '../hooks/web/usePermission';
import {
  COLLEGE_GET,
  CLASS_UPLOAD,
  COLLEGE_DELETE,
  COLLEGE_UPDATE,
} from '../store/modules/authority';
import { calcColWidth } from '../utils/actionCol';

/*
 * @Author: 黄纯峰
 * @Date: 2022-03-12 16:01:07
 * @LastEditTime: 2022-03-24 13:28:24
 * @Version: 1.0
 * @Description: TODO
 */
const { hasAnyAuthority } = usePermission();
const authorities = [COLLEGE_GET, COLLEGE_DELETE, CLASS_UPLOAD, COLLEGE_UPDATE];
export const collegeColumns: BasicColumn[] = [
  {
    dataIndex: 'clgCode',
    title: '学院代码',
    fixed: 'left',
    width: 80,
    slots: { customRender: 'id' },
  },
  {
    dataIndex: 'clgName',
    title: '学院',
    width: 200,
  },
  {
    dataIndex: 'principal',
    title: '负责人',
    width: 150,
  },
  {
    title: '学院办公室',
    dataIndex: 'clgOffice',
    width: 200,
  },
  {
    title: '电话',
    dataIndex: 'clgTel',
    width: 250,
  },
  {
    title: '创建时间',
    dataIndex: 'clgCreated',
    width: 150,
  },
  {
    title: '学院网址',
    dataIndex: 'clgHome',
    slots: { customRender: 'home' },
    width: 80,
  },
  {
    title: '操作',
    fixed: 'right',
    slots: { customRender: 'action' },
    width: calcColWidth(authorities),
    ifShow: () => hasAnyAuthority(authorities),
  },
];

export interface CollegeModel {
  clgCode: string;
  clgName: string;
  clgOffice: string;
  clgHome: string;
  clgTel: string;
  clgCreated: string;
}

export interface CollegeUpdateFormdata {
  clgName: string;
  teaId: string;
  clgTel: string;
  clgHome: string;
  clgOffice: string;
}

export interface CollegeInfoModel extends CollegeModel {
  principal: string;
  teaId: string;
}

export type CollegeQuery = Partial<CollegeModel>;

enum Api {
  BaseUrl = '/api/college',
  CollegeList = '/api/college/list',
  CollegeGrade = '/api/college/info',
  CollegeTree = '/api/college/tree',
  CollegeUpload = '/api/college/upload',
  TemplateDownload = '/api/college/template',
}

export function getCollegeList() {
  return defHttp.get<CollegeModel[]>({ url: Api.CollegeList }, { errorMessageMode: 'message' });
}

export function getCollegeInfo(clgCode: string, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<CollegeModel>({ url: Api.BaseUrl + `/${clgCode}` }, { errorMessageMode });
}

export function getCollegeTree(errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<TreeItem[]>({ url: Api.CollegeTree }, { errorMessageMode });
}

export function uploadCollege(
  file: File,
  name = 'file',
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  return defHttp.uploadFile({ url: Api.CollegeUpload }, { file, name }, { errorMessageMode });
}

export async function downloadFileTemplate(
  params: any = {},
  errorMessageMode: ErrorMessageMode = 'modal',
): Promise<boolean> {
  return defHttp.downloadFileByData({ url: Api.TemplateDownload, params }, { errorMessageMode });
}

export function pageCollege(params) {
  return defHttp.get({ url: Api.BaseUrl, params }, { errorMessageMode: 'message' });
}

export function deleteCollege(clgCode: string) {
  return defHttp.delete<boolean>(
    { url: Api.BaseUrl + `/${clgCode}` },
    { errorMessageMode: 'message' },
  );
}

export function updateCollege(data: CollegeUpdateFormdata) {
  return defHttp.put<boolean>(
    { url: Api.BaseUrl, data },
    {
      errorMessageMode: 'message',
    },
  );
}
