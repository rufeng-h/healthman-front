import { defHttp } from '/@/utils/http/axios';
import { LoginQuery, LoginResult } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import { UserInfo } from '/#/store';

enum Api {
  Login = '/login',
  Logout = '/api/logout',
  UserInfo = '/api/userInfo',
  PermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginQuery, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResult>(
    {
      url: Api.Login,
      data: params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.PermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function getUserInfo(errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.get<UserInfo>({ url: Api.UserInfo }, { errorMessageMode });
}
