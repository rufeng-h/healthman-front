import OrderEnum from '../enums/OrderEnum';

/*
 * @Author: 黄纯峰
 * @Date: 2022-03-15 10:56:38
 * @LastEditTime: 2022-03-15 11:05:22
 * @Version: 1.0
 * @Description: TODO
 */
export interface QueryOrder {
  field?: string;
  order?: OrderEnum | 'descend' | 'ascend';
}
