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
  import { getClassList } from '/@/api/ptclass';

  import { addMeasurement } from '/@/api/measurement';
  import { getSubGroupList } from '/@/api/subgroup';

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

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
          component: 'ApiSelect',
          componentProps: {
            immedite: true,
            api: getClassList,
            labelField: 'clsName',
            valueField: 'clsCode',
            mode: 'multiple',
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
        resetFields();
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
          setFieldsValue(fieldsValue);
        }
      });

      const modalTitle = computed(() => (!unref(isUpdate) ? '新增测试' : '编辑测试'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          const data = await addMeasurement(values);
          if (data) {
            emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
          }
          closeModal();
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerForm, modalTitle, handleSubmit, registerModal };
    },
  });
</script>
