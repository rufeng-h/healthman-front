import OrderEnum from '../enums/orderEnum';
import { UserInfoModel } from './sys/model/userModel';

/*
 * @Author: 黄纯峰
 * @Date: 2022-03-15 10:56:38
 * @LastEditTime: 2022-03-23 08:53:44
 * @Version: 1.0
 * @Description: TODO
 */
export interface QueryOrder {
  field?: string;
  order?: OrderEnum | 'descend' | 'ascend';
}

export interface AdminInfoModel extends UserInfoModel {
  phone: string;
  email: string;
}
