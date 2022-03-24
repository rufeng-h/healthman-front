/*
 * @Author: 黄纯峰
 * @Date: 2022-03-17 18:54:37
 * @LastEditTime: 2022-03-17 18:59:38
 * @Version: 1.0
 * @Description: TODO
 */

import { defHttp } from '../utils/http/axios';
import { ErrorMessageMode } from '/#/axios';

export interface SubjectModel {
  id: number;
  name: string;
  desp: string;
  createdTime: string;
}

enum Api {
  SubjectList = '/subject/list',
}

export function getSubjectList(errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<SubjectModel>({ url: Api.SubjectList }, { errorMessageMode });
}
