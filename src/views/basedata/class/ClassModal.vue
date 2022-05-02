<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="更新班级信息" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { getCollegeList } from '/@/api/college';
  import { ClassInfoModel } from '/@/api/ptclass';
  import { listTeacher } from '/@/api/teacher';

  export default defineComponent({
    name: 'ClassModal',
    components: { BasicModal, BasicForm },
    emits: ['submit', 'register'],
    setup(_, { emit }) {
      const state: any = reactive({
        clgOptions: undefined,
        teaOptions: undefined,
      });
      const { clgOptions, teaOptions } = toRefs(state);
      const accountFormSchema: FormSchema[] = [
        {
          field: 'clsCode',
          label: '班级代码',
          component: 'Input',
          componentProps: {
            disabled: true,
          },
        },
        {
          field: 'clsName',
          label: '班级名称',
          component: 'Input',
          rules: [
            {
              required: true,
              message: '请输入班级名',
              trigger: 'blur',
            },
          ],
        },
        {
          field: 'clgCode',
          label: '所属学院',
          component: 'Select',
          componentProps: {
            options: clgOptions,
          },
          required: true,
          ifShow() {
            return state.clgOptions.length !== 0;
          },
        },
        {
          field: 'clsEntryYear',
          label: '入学年度',
          component: 'Input',
          componentProps: {
            disabled: true,
          },
        },
        {
          field: 'gradeZhcn',
          label: '年级',
          component: 'Input',
          componentProps: {
            disabled: true,
          },
        },
        /* TODO优化 */
        {
          field: 'teaId',
          label: '任课教师',
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

      const [registerModal, { closeModal }] = useModalInner(async (record: ClassInfoModel) => {
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
        if (state.clgOptions === undefined) {
          state.clgOptions = (await getCollegeList()).map((clg) => {
            return {
              label: clg.clgName,
              value: clg.clgCode,
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
