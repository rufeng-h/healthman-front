<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="modalTitle"
    @ok="handleSubmit"
    :min-height="200"
  >
    <BasicForm @register="registerForm">
      <template #status="{ model, field }">
        <Switch v-model:checked="model[field]" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { listOper } from '/@/api/operation';
  import { RoleInfoModel } from '/@/api/role';
  import { Switch } from 'ant-design-vue';

  interface TreeData {
    title: string;
    value: string | number;
    key: string | number;
    children: TreeData[];
    pid: number;
  }

  export default defineComponent({
    name: 'RoleModal',
    components: { BasicModal, BasicForm, Switch },
    emits: ['submit', 'register'],
    setup(_, { emit }) {
      const state: any = reactive({
        isUpdate: false,
        rowId: 0,

        operations: undefined,
        selectedOpers: [],
      });

      const { operations } = toRefs(state);

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
          field: 'operIds',
          label: '权限',
          component: 'TreeSelect',
          componentProps: {
            treeCheckable: true,
            allowClear: true,
            treeData: operations,
          },
          required: true,
        },
        {
          field: 'status',
          label: '状态',
          component: 'Input',
          slot: 'status',
          required: true,
          defaultValue: true,
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
        state.rowId = 0;
        if (state.operations === undefined) {
          const data = await listOper();
          data.sort((a, b) => a.operId - b.operId);
          const map: Recordable<TreeData> = {};
          data.forEach((o) => {
            const item = {
              title: o.operSummary,
              key: o.operId,
              value: o.operId,
              children: [],
              pid: o.pid,
            };
            map[o.operId] = item;

            if (item.pid !== 0) {
              map[item.pid].children.push(item);
            }
            state.operations = Object.values(map).filter((o) => o.pid === 0);
          });
        }

        if (state.isUpdate) {
          const record: RoleInfoModel = data.record;
          state.rowId = record.roleId;
          const operIds = record.operations.map((o) => o.operId);
          setFieldsValue({ ...record, operIds });
        }
      });

      const modalTitle = computed(() => (!state.isUpdate ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        const values = await validate();
        emit('submit', state.isUpdate ? { ...values, roleId: state.rowId } : values);
        closeModal();
      }

      return { registerForm, modalTitle, handleSubmit, registerModal };
    },
  });
</script>
