<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="modalTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { getClassList } from '/@/api/ptclass';
  import { getCollegeList } from '/@/api/college';
  import { addUser, AdminRoleTypeEnum } from '/@/api/admin';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

      const accountFormSchema: FormSchema[] = [
        {
          field: 'adminId',
          label: '工号',
          component: 'Input',
          rules: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur',
            },
          ],
          ifShow() {
            return !isUpdate.value;
          },
        },
        {
          field: 'adminName',
          label: '用户名',
          component: 'Input',
          rules: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur',
            },
          ],
        },
        {
          field: 'password',
          label: '密码',
          component: 'InputPassword',
          required: true,
          ifShow() {
            return !isUpdate.value;
          },
        },
        {
          field: 'roleTypes',
          label: '角色',
          component: 'CheckboxGroup',
          componentProps: () => {
            return {
              options: [
                {
                  label: '系统管理员',
                  value: AdminRoleTypeEnum.SYSTEM,
                },
                {
                  label: '学院管理员',
                  value: AdminRoleTypeEnum.COLLEGE,
                },
                {
                  label: '班级管理员',
                  value: AdminRoleTypeEnum.CLASS,
                },
              ],
            };
          },
          required: true,
        },
        {
          required: true,
          label: '学院',
          field: 'clgCodes',
          component: 'ApiSelect',
          ifShow({ field, model }) {
            return (
              field === 'clgCodes' &&
              model.roleTypes &&
              model.roleTypes.indexOf(AdminRoleTypeEnum.COLLEGE) !== -1
            );
          },
          componentProps() {
            return {
              api: getCollegeList,
              labelField: 'clgName',
              valueField: 'clgCode',
              allowClear: true,
              mode: 'multiple',
              placeholder: '选择学院',
              showSearch: true,
            };
          },
        },
        {
          required: true,
          label: '班级',
          field: 'clsCodes',
          component: 'ApiSelect',
          componentProps() {
            return {
              api: getClassList,
              allowClear: true,
              labelField: 'clsName',
              valueField: 'clsCode',
              mode: 'multiple',
              placeholder: '选择班级',
              showSearch: true,
            };
          },
          ifShow({ field, model }) {
            return (
              field === 'clsCodes' &&
              model.roleTypes &&
              model.roleTypes.indexOf(AdminRoleTypeEnum.CLASS) !== -1
            );
          },
        },
        {
          label: '邮箱',
          field: 'email',
          component: 'Input',
          required: true,
          rules: [
            { type: 'email', trigger: 'blur', message: '请输入正确的邮箱' },
            { required: true, message: '请输入邮箱', trigger: 'blur' },
          ],
        },
        {
          label: '手机',
          field: 'phoen',
          component: 'Input',
          required: true,
          rules: [
            {
              type: 'string',
              pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
              trigger: 'blur',
              message: '请输入正确的手机号',
            },
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur',
            },
          ],
          componentProps: {
            type: 'phone',
          },
        },
        {
          label: '备注',
          field: 'desp',
          component: 'InputTextArea',
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

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        const { record } = data;
        // TODO
        console.log(record);

        if (unref(isUpdate)) {
          rowId.value = record.userId;
          setFieldsValue({
            adminName: record.username,
            roleTypes: Array.from(new Set(record.roles.map((r) => r.roleType))),
            clgCodes: [],
            clsCodes: [],
          });
        }
      });

      const modalTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          const userInfo = await addUser(values);
          createMessage.success('添加成功 ' + userInfo.userId);
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
          closeModal();
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerForm, modalTitle, handleSubmit, registerModal };
    },
  });
</script>
