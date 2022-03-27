import { FormSchema } from '/@/components/Form';
import { GenderEnum } from '/@/enums/genderEnum';
import { gradeOptions } from '/@/enums/gradeEnum';

export const step1Schemas: FormSchema[] = [
  {
    field: 'subName',
    component: 'Input',
    label: '科目名称',
    defaultValue: '666米跑',
    rules: [
      {
      required: true,
      message: '请输入科目名称',
      trigger: 'blur'
    }
  ]
  },
  // {
  //   field: 'subType',
  //   component: 'RadioGroup',
  //   label: '科目类型',
  //   required: true,
  //   componentProps:{
  //     options:[{'label': '为年级添加', 'value': '1'},{label: '为班级添加', value:'2'}]
  //   }
  // },
  {
    field: 'grades',
    component: 'Select',
    label: '年级',
    componentProps: {
      options: gradeOptions,
      allowClear: true,
      mode: 'multiple',
    },
    defaultValue: ['2', '5'],
    required: true,
  },
  {
    field: 'genders',
    component: 'CheckboxGroup',
    label: '性别',
    componentProps: {
      options: [{label: '男生', value: 'M'},{label: '女生', value: 'F'}],
    },
    defaultValue: ['M', 'F'],
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
  // {
  //   field: 'account',
  //   component: 'Select',
  //   label: '付款账户',
  //   required: true,
  //   defaultValue: '1',
  //   componentProps: {
  //     options: [
  //       {
  //         label: 'anncwb@126.com',
  //         value: '1',
  //       },
  //     ],
  //   },
  // },
  // {
  //   field: 'fac',
  //   component: 'InputGroup',
  //   label: '收款账户',
  //   required: true,
  //   defaultValue: 'test@example.com',
  //   slot: 'fac',
  // },
  // {
  //   field: 'pay',
  //   component: 'Input',
  //   label: '',
  //   defaultValue: 'zfb',
  //   show: false,
  // },
  // {
  //   field: 'payeeName',
  //   component: 'Input',
  //   label: '收款人姓名',
  //   defaultValue: 'Vben',
  //   required: true,
  // },
  // {
  //   field: 'money',
  //   component: 'Input',
  //   label: '转账金额',
  //   defaultValue: '500',
  //   required: true,
  //   renderComponentContent: () => {
  //     return {
  //       prefix: () => '￥',
  //     };
  //   },
  // },
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


