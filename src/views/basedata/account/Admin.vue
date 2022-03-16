<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:36:06
 * @LastEditTime: 2022-03-16 17:16:18
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <PageWrapper content-full-height dense content-background>
    <BasicTable
      :api="getUserList"
      :columns="userColumns"
      :title="tableTitle"
      show-table-setting
      title-help-message="温馨提示"
      use-search-form
      row-key="id"
      :action-column="actionColumn"
      :form-config="formConfig"
      :table-setting="{ fullScreen: true }"
    >
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看用户详情',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此账号',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">添加用户</a-button>
      </template>
      <template #avatar="{ record }">
        <Image :src="record.avatar" :width="30" :height="30" />
      </template>
    </BasicTable>
    <UserModal @register="userModal" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Image } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { FormProps } from '/@/components/Form';
  import { ref } from 'vue';
  import { getCollegeList } from '/@/api/college';
  import { userColumns, getUserList } from '/@/api/user';
  import UserModal from './UserModal.vue';
  import { useModal } from '/@/components/Modal';
  const tableTitle = ref('');
  const actionColumn = {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  };
  const formConfig: FormProps = {
    submitOnReset: false,
    labelWidth: 100,
    showAdvancedButton: true,
    compact: true,
    schemas: [
      {
        field: 'collegeId',
        label: '学院',
        component: 'ApiSelect',
        colProps: {
          span: 8,
        },
        componentProps: {
          api: getCollegeList,
          immediate: true,
          labelField: 'name',
          valueField: 'id',
          showSearch: true,
          onSelect: (_: string, opt) => {
            tableTitle.value = opt.label;
          },
        },
        required: true,
      },
    ],
  };

  const [userModal, { openModal }] = useModal();

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    console.log(record);
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  function handleDelete(record: Recordable) {
    console.log(record);
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      // 演示不刷新表格直接更新内部数据。
      // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
    } else {
      reload();
    }
  }

  function handleSelect(deptId = '') {
    searchInfo.deptId = deptId;
    reload();
  }

  function handleView(record: Recordable) {
    go('/system/account_detail/' + record.id);
  }
</script>

<style scoped lang="less">
  ::v-deep(td .ant-image .ant-image-img) {
    max-width: 30px;
    max-height: 30px;
  }
</style>
