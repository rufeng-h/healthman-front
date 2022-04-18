<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="修改密码" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  export default defineComponent({
    components: {
      BasicForm,
      BasicModal,
    },
    emits: ['register', 'submit'],
    setup(_, { emit }) {
      const formSchema: FormSchema[] = [
        {
          field: 'oldPwd',
          label: '当前密码',
          component: 'InputPassword',
          required: true,
        },
        {
          field: 'newPwd',
          label: '新密码',
          component: 'StrengthMeter',
          componentProps: {
            placeholder: '新密码',
          },
          rules: [
            {
              required: true,
              message: '请输入新密码',
            },
            {
              type: 'string',
              min: 6,
              trigger: 'blur',
              message: '最少6个字符',
            },
            {
              max: 20,
              trigger: 'blur',
              message: '最多20个字符',
            },
          ],
        },
        {
          field: 'confirmPassword',
          label: '确认密码',
          component: 'InputPassword',

          dynamicRules: ({ values }) => {
            return [
              {
                required: true,
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject('密码不能为空');
                  }
                  if (value !== values.newPwd) {
                    return Promise.reject('两次输入的密码不一致!');
                  }
                  return Promise.resolve();
                },
              },
            ];
          },
        },
      ];
      const [registerModal, { closeModal }] = useModalInner();
      const [registerForm, { validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      async function handleSubmit() {
        const values = await validate();
        values.confirmPassword = undefined;
        emit('submit', values);
        closeModal();
      }

      return { registerForm, handleSubmit, registerModal };
    },
  });
</script>
