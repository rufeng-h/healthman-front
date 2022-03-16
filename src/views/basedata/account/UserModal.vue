<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="modalTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { ClassQuery, getClassList } from '/@/api/ptclass';
  import { getCollegeList } from '/@/api/college';
  import { addUser, RoleType } from '/@/api/user';

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const classListParams: ClassQuery = reactive({ collegeId: undefined });

      const accountFormSchema: FormSchema[] = [
        {
          field: 'username',
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
        },
        {
          field: 'roleType',
          label: '角色',
          component: 'RadioGroup',
          componentProps: () => {
            return {
              onChange(e: Event) {
                console.log(e);
              },
              options: [
                {
                  label: '系统管理员',
                  value: RoleType.SYSTEM,
                },
                {
                  label: '学院管理员',
                  value: RoleType.COLLEGE,
                },
                {
                  label: '班级管理员',
                  value: RoleType.CLASS,
                },
              ],
            };
          },
          required: true,
        },
        {
          required: false,
          label: '学院',
          field: 'collegeId',
          component: 'ApiSelect',
          show({ field, model }) {
            return (
              field === 'collegeId' &&
              (model.roleType === RoleType.COLLEGE || model.roleType === RoleType.CLASS)
            );
          },
          componentProps() {
            return {
              api: getCollegeList,
              labelField: 'name',
              valueField: 'id',
              onSelect(value: number) {
                setFieldsValue({ classCode: undefined });
                classListParams.collegeId = value;
              },
            };
          },
        },
        {
          required: false,
          label: '班级',
          field: 'classCode',
          component: 'ApiSelect',
          componentProps() {
            return {
              immediate: false,
              params: classListParams,
              api: getClassList,
              labelField: 'name',
              valueField: 'code',
            };
          },
          show({ field, model }) {
            return field === 'classCode' && model.roleType === RoleType.CLASS;
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
          label: '备注',
          field: 'desp',
          component: 'InputTextArea',
        },
      ];

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
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

        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
        }

        // const treeData = await getDeptList();
        // updateSchema([
        //   {
        //     field: 'pwd',
        //     show: !unref(isUpdate),
        //   },
        //   {
        //     field: 'dept',
        //     componentProps: { treeData },
        //   },
        // ]);
      });

      const modalTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          await addUser(values);
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerForm, modalTitle, handleSubmit, registerModal };
    },
  });
</script>
