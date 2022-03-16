import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResult } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/login',
  Logout = '/api/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
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
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}
