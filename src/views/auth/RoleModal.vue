<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="modalTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { listOper } from '/@/api/operation';

  export default defineComponent({
    name: 'RoleModal',
    components: { BasicModal, BasicForm },
    emits: ['submit', 'register'],
    setup(_, { emit }) {
      const state: any = reactive({
        isUpdate: false,
        rowId: 0,
      });

      const accountFormSchema: FormSchema[] = [
        {
          field: 'roleName',
          label: '角色名称',
          component: 'Input',
          rules: [
            {
              required: true,
              message: '请输入角色名',
              trigger: 'blur',
            },
          ],
        },
        {
          field: 'roleDesp',
          label: '备注信息',
          component: 'Input',
          rules: [
            {
              required: true,
              message: '请输入备注信息',
              trigger: 'blur',
            },
          ],
          defaultValue: '暂无信息',
        },
        {
          field: 'oprations',
          label: '权限',
          component: 'ApiSelect',
          componentProps: {
            api: listOper,
            valueField: 'operId',
            labelField: 'operSummary',
          },
          required: true,
        },
      ];

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { closeModal }] = useModalInner(async (data) => {
        resetFields();
        state.isUpdate = !!data?.isUpdate;
        const { record } = data;
        // TODO
        console.log(record);
        if (state.isUpdate) {
          setFieldsValue(record);
        }
      });

      const modalTitle = computed(() => (!state.isUpdate ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        const values = await validate();
        emit('submit', values);
        closeModal();
      }

      return { registerForm, modalTitle, handleSubmit, registerModal };
    },
  });
</script>
