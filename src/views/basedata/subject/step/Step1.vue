<template>
  <div class="w-3/5" style="margin: auto">
    <BasicForm @register="register" ref="formRef">
      <template #level="{ model, field }">
        <TagAdd v-model:tags="model[field]" :default-value="defaultLevel" />
      </template>
    </BasicForm>
  </div>
</template>
<script lang="ts" setup>
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import TagAdd from './TagAdd.vue';
  import { gradeOptions } from '/@/enums/gradeEnum';
  import { ref } from 'vue';
  import { listCompetency } from '/@/api/competency';
  const defaultLevel = ['优秀', '良好', '及格', '不及格'];
  const emit = defineEmits(['next']);
  const formRef = ref();
  defineExpose({ formRef });
  const step1Schemas: FormSchema[] = [
    {
      field: 'subName',
      component: 'Input',
      label: '科目名称',
      rules: [
        {
          required: true,
          message: '请输入科目名称',
          trigger: 'blur',
        },
      ],
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
        options: [
          { label: '男生', value: 'M' },
          { label: '女生', value: 'F' },
        ],
      },
      required: true,
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
      field: 'compId',
      component: 'ApiSelect',
      componentProps: {
        api: listCompetency,
        labelField: 'compName',
        valueField: 'compId',
      },
      label: '运动能力',
      required: false,
    },
    {
      field: 'subDesp',
      component: 'InputTextArea',
      label: '备注信息',
      required: false,
      defaultValue: '这是备注信息',
    },
  ];
  const [register, { validate }] = useForm({
    labelWidth: 100,
    schemas: step1Schemas,
    actionColOptions: {
      span: 14,
    },
    showResetButton: false,
    submitButtonOptions: {
      text: '下一步',
    },
    submitFunc: customSubmitFunc,
  });
  async function customSubmitFunc() {
    try {
      const values = await validate();
      emit('next', values);
    } catch (error) {}
  }
</script>
