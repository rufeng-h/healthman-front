<template>
  <div>
    <PageWrapper content-full-height dense content-background>
      <div class="w-3/4 mx-auto">
        <BasicTable @register="tableRef">
          <template #action="{ record }">
            <TableAction
              :actions="[
                {
                  icon: 'ant-design:delete-outlined',
                  color: 'error',
                  tooltip: '删除此角色',
                  popConfirm: {
                    title: `删除角色${record.roleName}？`,
                    confirm: handleDelete.bind(null, record),
                  },
                  ifShow: () => hasPermission(PtRole.roleDelete),
                },
                {
                  icon: 'clarity:note-edit-line',
                  tooltip: '编辑',
                  onClick: handleEdit.bind(null, record),
                  ifShow: () => hasPermission(PtRole.roleUpdate),
                },
              ]"
            />
          </template>
          <template #status="{ record }">
            <Switch v-model:checked="record.status" />
          </template>
          <template #toolbar>
            <a-button
              type="primary"
              v-if="hasPermission(PtRole.roleInsert)"
              @click="tryAddRole"
              pre-icon="ant-design:plus-circle-outlined"
              >新增角色
            </a-button>
          </template>
        </BasicTable>
      </div>
    </PageWrapper>
    <RoleModal @register="roleModal" @submit="handleAdd" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import {
    addRole,
    deleteRole,
    pageRole,
    PtRoleFormdata,
    roleColumns,
    RoleInfoModel,
    updateRole,
  } from '/@/api/role';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { PtRole } from '/@/store/modules/authority';
  import RoleModal from './RoleModal.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useLoading } from '/@/components/Loading';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Switch } from 'ant-design-vue';

  const { hasPermission } = usePermission();
  const { createMessage } = useMessage();
  const [openFullLoading, closeFullLoading] = useLoading({
    tip: '请稍后...',
  });

  const [roleModal, { openModal: openRoleModal }] = useModal();

  function tryAddRole() {
    openRoleModal(true, { isUpdate: false });
  }

  async function handleDelete(record: RoleInfoModel) {
    try {
      openFullLoading();
      const success = await deleteRole(record.roleId);
      if (success) {
        createMessage.success('操作成功！');
        await reload({ page: 1 });
      }
    } finally {
      closeFullLoading();
    }
  }
  async function handleEdit(record: RoleInfoModel) {
    openRoleModal(true, { isUpdate: true, record });
  }

  async function editSubmit(data: PtRoleFormdata) {
    try {
      openFullLoading();
      const success = data.roleId ? await updateRole(data) : await addRole(data);
      if (success) {
        createMessage.success('操作成功！');
        await reload({ page: 1 });
      }
    } finally {
      closeFullLoading();
    }
  }

  const [tableRef, { reload }] = useTable({
    api: pageRole,
    title: '角色列表',
    columns: roleColumns,
    showTableSetting: true,
    titleHelpMessage: '温馨提示',
    rowKey: 'roleId',
    canResize: false,
    showIndexColumn: true,
    indexColumnProps: {
      dataIndex: '',
      title: '序号',
    },
    tableSetting: { fullScreen: true },
  });

  export default defineComponent({
    components: {
      BasicTable,
      RoleModal,
      PageWrapper,
      Switch,
      TableAction,
    },
    setup() {
      return {
        tableRef,
        roleModal,
        PtRole,
        hasPermission,

        tryAddRole,
        handleAdd: editSubmit,
        handleDelete,
        handleEdit,
      };
    },
  });
</script>
