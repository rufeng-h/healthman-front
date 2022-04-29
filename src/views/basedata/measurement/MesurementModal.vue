<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="modalTitle"
    @ok="handleSubmit"
    centered
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { getSubGroupList } from '/@/api/subgroup';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register', 'cancel'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const userInfo = useUserStore().getUserInfo;
      const clsOpts = userInfo?.classes?.map((cls) => {
        return {
          label: cls.clsName,
          value: cls.clsCode,
        };
      });
      const msScheme: FormSchema[] = [
        {
          label: '测试名称',
          field: 'msName',
          component: 'Input',
          rules: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur',
            },
          ],
        },
        {
          label: '说明信息',
          field: 'msDesp',
          component: 'Input',
          rules: [
            {
              required: true,
              message: '请输入说明',
              trigger: 'blur',
            },
          ],
        },
        {
          label: '科目组',
          field: 'grpId',
          component: 'ApiSelect',
          componentProps: {
            api: getSubGroupList,
            labelField: 'grpName',
            valueField: 'grpId',
          },
          required: true,
        },
        {
          label: '选择班级',
          field: 'clsCodes',
          component: 'Select',
          componentProps: {
            mode: 'multiple',
            options: clsOpts,
          },
          required: true,
        },
      ];

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: msScheme,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          const { record } = data;
          const fieldsValue = {
            msName: record.msName,
            msDesp: record.msDesp,
            clsCodes: record.classes.map((cls) => cls.clsCode),
            grpId: record.grpId,
          };
          rowId.value = record.msId;
          await setFieldsValue(fieldsValue);
        }
      });

      const modalTitle = computed(() => (!unref(isUpdate) ? '新增体测' : '编辑体测'));

      async function handleSubmit() {
        const values = await validate();
        emit('success', {
          isUpdate: unref(isUpdate),
          values: { ...values, msId: unref(isUpdate) ? rowId.value : '' },
        });
        closeModal();
      }
      return { registerForm, modalTitle, handleSubmit, registerModal };
    },
  });
</script>
