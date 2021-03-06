import { defHttp } from '/@/utils/http/axios';
import { LoginQuery, LoginResult } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import { UserInfo } from '/#/store';

enum Api {
  Login = '/login',
  Logout = '/api/logout',
  UserInfo = '/api/userInfo',
  PermCode = '/getPermCode',
  AvatarUpload = '/upload/avatar',
  UpdatePwd = '/api/password',
  UpdateUser = '/api/user',
}

export interface PwdModifyFormdata {
  oldPwd: string;
  newPwd: string;
}

export interface UpdateUserFormdata {
  avatar: string;
  desp: string;
  phone: string;
  email: string;
  birth?: string;
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

export function updatePwd(data: PwdModifyFormdata) {
  return defHttp.put<boolean>({ url: Api.UpdatePwd, data }, { errorMessageMode: 'message' });
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

export function uploadAvatar({ file, name, filename }) {
  return defHttp.uploadFile<string>(
    { url: Api.AvatarUpload },
    { file, name, filename },
    { errorMessageMode: 'message' },
  );
}

export function updateUser(data: UpdateUserFormdata) {
  return defHttp.put<boolean>({ url: Api.UpdateUser, data }, { errorMessageMode: 'message' });
}
