<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="修改个人信息" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #avatar="{ model, field }">
        <CropperAvatar
          v-model:value="model[field]"
          width="80px"
          :show-btn="false"
          :upload-api="uploadAvatar"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { UserInfo } from '/#/store';
  import { UserTypeEnum } from '/@/enums/userTypeEnum';
  import { CropperAvatar } from '/@/components/Cropper';
  import { uploadAvatar } from '/@/api/sys/user';

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm, CropperAvatar },
    emits: ['submit', 'register'],
    setup(_, { emit }) {
      let userId: string | undefined = undefined;
      let userType: UserTypeEnum | undefined = undefined;
      const adminFormSchemas: FormSchema[] = [
        {
          field: 'birth',
          label: '出生日期',
          component: 'DatePicker',
          componentProps: {
            type: 'date',
            format: 'yyyy-MM-DD',
          },
          required: true,
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
          field: 'phone',
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
          field: 'avatar',
          slot: 'avatar',
          component: 'Input',
          label: '头像',
          required: true,
        },
        {
          label: '备注信息',
          field: 'desp',
          component: 'InputTextArea',
          required: true,
        },
      ];

      const stuFormSchemas: FormSchema[] = [
        {
          field: 'birth',
          label: '出生日期',
          component: 'DatePicker',
          componentProps: {
            type: 'date',
            format: 'yyyy-MM-DD',
          },
          required: true,
        },
        {
          field: 'avatar',
          slot: 'avatar',
          component: 'Input',
          label: '头像',
          required: true,
        },
        {
          label: '备注信息',
          field: 'desp',
          component: 'InputTextArea',
          required: true,
        },
      ];

      const [registerForm, { setFieldsValue, resetFields, validate, setProps }] = useForm({
        labelWidth: 100,
        schemas: [],
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { closeModal }] = useModalInner(async (userInfo: UserInfo) => {
        resetFields();
        userType = userInfo.userType;
        userId = userInfo.userId;
        const schemas =
          userInfo.userType === UserTypeEnum.ADMIN ? adminFormSchemas : stuFormSchemas;
        setProps({ schemas });
        nextTick(() => setFieldsValue(userInfo));
      });
      async function handleSubmit() {
        const values = await validate();
        emit('submit', { ...values, userId, userType });
        closeModal();
      }

      return { registerForm, handleSubmit, registerModal, uploadAvatar };
    },
  });
</script>
