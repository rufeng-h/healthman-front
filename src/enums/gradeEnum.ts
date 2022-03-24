/*
 * @Author: 黄纯峰
 * @Date: 2022-03-22 23:34:22
 * @LastEditTime: 2022-03-23 10:12:31
 * @Version: 1.0
 * @Description: TODO
 */
interface Grade {
  value: string;
  grade: number;
}

class PRIMARY_ONE implements Grade {
  readonly value: string = '一年级';
  readonly grade: number = 1;
}

class PRIMARY_TWO implements Grade {
  readonly value: string = '二年级';
  readonly grade: number = 2;
}

export enum GradeEnum {
  PRIMARY_ONE,
  PRIMARY_TWO,
}

const gradeMappings = {
  1: '一年级',
  2: '二年级',
  3: '三年级',
  4: '四年级',
  5: '五年级',
  6: '六年级',
  7: '初一',
  8: '初二',
  9: '初三',
  10: '高一',
  11: '高二',
  12: '高三',
  13: '大一',
  14: '大二',
  15: '大三',
  16: '大四',
};

export function numberGradeToZhcn(grade: number): string {
  if (grade > 16) {
    return `毕业${grade - 16}年`;
  }

  return gradeMappings[grade];
}
