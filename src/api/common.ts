import OrderEnum from '../enums/orderEnum';

export interface QueryOrder {
  field?: string;
  order?: OrderEnum;
}
