import { defHttp } from '/@/utils/http/axios';
import { MenuItem } from './model/menuModel';

enum Api {
  GetMenuList = '/api/menu',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<MenuItem[]>({ url: Api.GetMenuList });
};
