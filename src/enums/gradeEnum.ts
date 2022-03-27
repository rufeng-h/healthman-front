/*
 * @Author: 黄纯峰
 * @Date: 2022-03-22 23:34:22
 * @LastEditTime: 2022-03-25 08:55:50
 * @Version: 1.0
 * @Description: TODO
 */

export const gradeMappings = {
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

export const gradeOptions = Object.keys(gradeMappings).map((key) => {
  return {
    label: gradeMappings[key].toString(),
    value: key,
  };
});

export function numberGradeToZhcn(grade: number | string): string {
  if (typeof grade === 'string') {
    grade = parseInt(grade);
  }

  if (grade > 16) {
    return `毕业${grade - 16}年`;
  }

  return gradeMappings[grade];
}

const gradeEnumMappings = {
  1: 'PRIMARY_ONE',
  2: 'PRIMARY_TWO',
  3: 'PRIMARY_THREE',
  4: 'PRIMARY_FOUR',
  5: 'PRIMARY_FIVE',
  6: 'PRIMARY_SIX',
  7: 'JUNIOR_ONE',
  8: 'JUNIOR_TWO',
  9: 'JUNIOR_THREE',
  10: 'SENIOR_ONE',
  11: 'SENIRO_TWO',
  12: 'SENIOR_THREE',
  13: 'COLLEGE_ONE',
  14: 'COLLEGE_TWO',
  15: 'COLLEGE_THREE',
  16: 'COLLEGE_FOUR',
};

export function getGradeEnum(grade: number | string): string {
  if (typeof grade === 'string') {
    grade = parseInt(grade);
  }
  const grd = gradeEnumMappings[grade];
  if (!grd) {
    throw new Error('未知年级' + grade);
  }
  return grd;
}
