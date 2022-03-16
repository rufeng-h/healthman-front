import { ErrorMessageMode } from './../../types/axios.d';
import { defHttp } from '/@/utils/http/axios';
import { BasicColumn } from './../components/Table/src/types/table';
import { MajorModel } from './major';
import { TreeItem } from '../components/Tree';
/*
 * @Author: 黄纯峰
 * @Date: 2022-03-12 16:01:07
 * @LastEditTime: 2022-03-13 20:46:48
 * @Version: 1.0
 * @Description: TODO
 */
export const collegeColumns: BasicColumn[] = [
  {
    dataIndex: 'id',
    title: '代码',
    fixed: 'left',
    width: 80,
    slots: { customRender: 'id' },
  },
  {
    dataIndex: 'name',
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
    dataIndex: 'office',
    width: 200,
  },
  {
    title: '电话',
    dataIndex: 'tel',
    width: 250,
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: 200,
  },
  {
    title: '学院网址',
    dataIndex: 'home',
    slots: { customRender: 'home' },
    width: 80,
  },
];

export interface CollegeModel {
  id: number | string;
  name: string;
  office: string;
  home: string;
  tel: string;
  createdTime: string;
  principal: string;
}

export type CollegeQuery = Partial<CollegeModel>;

export interface CollegeInfoModel {
  id: number;
  grades: number[];
  majors: MajorModel[];
}

enum Api {
  collegeList = '/api/college/list',
  collegeGrade = '/api/college/info',
  collegeTree = '/api/college/tree',
}

export function getCollegeList(msgMode: ErrorMessageMode = 'modal') {
  return defHttp.get<CollegeModel>({ url: Api.collegeList }, { errorMessageMode: msgMode });
}

export function getCollegeInfo(
  params: { id: string },
  errorMessageMode: ErrorMessageMode = 'modal',
) {
  return defHttp.get<CollegeInfoModel>({ url: Api.collegeGrade, params }, { errorMessageMode });
}

export function getCollegeTree(errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<TreeItem[]>({ url: Api.collegeTree }, { errorMessageMode });
}
