import { FormSchema } from '/@/components/Form';
import { GenderEnum } from '/@/enums/genderEnum';
import { gradeOptions } from '/@/enums/gradeEnum';

export const step1Schemas: FormSchema[] = [
  {
    field: 'subName',
    component: 'Input',
    label: '科目名称',
    rules: [
      {
      required: true,
      message: '请输入科目名称',
      trigger: 'blur'
    }
  ]
  },
  {
    field: 'grades',
    component: 'Select',
    label: '年级',
    componentProps: {
      options: gradeOptions,
      allowClear: true,
      mode: 'multiple',
    },
    required: true,
  },
  {
    field: 'genders',
    component: 'CheckboxGroup',
    label: '性别',
    componentProps: {
      options: [{label: '男生', value: 'M'},{label: '女生', value: 'F'}],
    },
    required:true,
  },
  {
    field: 'level',
    label: '可选等级',
    component: 'Input',
    slot: 'level',
    required: false,
    defaultValue: [],
  },
  {
    field: 'subDesp',
    component: 'InputTextArea',
    label: '备注信息',
    required: false,
    defaultValue: '这是备注信息',
  },
];

export interface ScoreSheetItem {
  upper: number;
  lower: number;
  score: number;
  level: string;
}

export const defaultLevel = ['优秀', '良好', '及格', '不及格'];

export const step2Schemas: FormSchema[] = [
  {
    field: 'lower',
    component: 'InputNumber',
    label: '上限',
    required: true,
    defaultValue: 0,
  },
  {
    field: 'upper',
    component: 'InputNumber',
    label: '下限',
    required: true,
    defaultValue: 0,
  }
];

export interface SubjectInfo {
  subName: string;
  subDesp?: string | undefined;
  level: string[];
  genders: GenderEnum[];
  grades: number[];
}


