<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="更新班级信息" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { CollegeInfoModel } from '/@/api/college';
  import { listTeacher } from '/@/api/teacher';

  export default defineComponent({
    name: 'ClassModal',
    components: { BasicModal, BasicForm },
    emits: ['submit', 'register'],
    setup(_, { emit }) {
      const state: any = reactive({
        teaOptions: undefined,
      });

      const { teaOptions } = toRefs(state);
      const accountFormSchema: FormSchema[] = [
        {
          field: 'clgCode',
          label: '学院代码',
          component: 'Input',
          componentProps: {
            disabled: true,
          },
        },
        {
          field: 'clgName',
          label: '学院名称',
          component: 'Input',
          rules: [
            {
              required: true,
              message: '请输入学院名',
              trigger: 'blur',
            },
          ],
        },
        {
          field: 'clgTel',
          label: '电话',
          component: 'Input',
          required: true,
        },
        {
          field: 'clgOffice',
          label: '办公室',
          component: 'Input',
          rules: [
            {
              required: true,
              message: '请输入办公室',
              trigger: 'blur',
            },
          ],
        },
        {
          field: 'clgHome',
          label: '主页',
          component: 'Input',
          rules: [
            {
              required: true,
              message: '请输入学院网址',
              trigger: 'blur',
            },
          ],
        },
        /* TODO优化 */
        {
          field: 'teaId',
          label: '负责人',
          component: 'Select',
          componentProps: {
            options: teaOptions,
            showSearch: true,
            optionFilterProp: 'label',
          },
          required: true,
        },
      ];

      const [registerForm, { setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { closeModal }] = useModalInner(async (record: CollegeInfoModel) => {
        if (state.teaOptions === undefined) {
          state.teaOptions = (await listTeacher()).map((tea) => {
            return {
              label: tea.clgName
                ? `${tea.clgName} ${tea.teaId} ${tea.teaName}`
                : `${tea.teaId} ${tea.teaName}`,
              value: tea.teaId,
            };
          });
        }
        setFieldsValue(record);
      });

      async function handleSubmit() {
        const values = await validate();
        emit('submit', values);
        closeModal();
      }

      return { registerForm, handleSubmit, registerModal };
    },
  });
</script>
