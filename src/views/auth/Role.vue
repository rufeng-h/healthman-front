<template>
  <div>
    <PageWrapper content-full-height dense content-background>
      <div class="w-2/3 mx-auto">
        <BasicTable @register="tableRef">
          <template #toolbar>
            <a-button
              type="primary"
              v-if="hasPermission(PtRole.rolePage)"
              @click="tryAddRole"
              pre-icon="ant-design:plus-circle-outlined"
              >新增角色
            </a-button>
          </template>
        </BasicTable>
      </div>
    </PageWrapper>
  </div>
  <RoleModal @register="roleModal" @submit="addRole" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { pageRole, PtRoleFormdata, roleColumns } from '/@/api/role';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { PtRole } from '/@/store/modules/Authority';
  import RoleModal from './RoleModal.vue';

  const { hasPermission } = usePermission();

  const [roleModal, { openModal: openRoleModal }] = useModal();

  function tryAddRole() {
    openRoleModal(true, { isUpdate: false });
  }

  async function addRole(data: PtRoleFormdata) {
    console.log(data);
  }

  const [tableRef, { reload }] = useTable({
    api: pageRole,
    title: '角色列表',
    columns: roleColumns,
    showTableSetting: true,
    titleHelpMessage: '温馨提示',
    rowKey: 'roleId',
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
    },
    setup() {
      return {
        tableRef,
        roleModal,
        PtRole,
        hasPermission,

        tryAddRole,
        addRole,
      };
    },
  });
</script>
