<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:36:06
 * @LastEditTime: 2022-03-21 18:28:54
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <PageWrapper content-full-height dense content-background>
    <BasicTable @register="tableRef">
      <template #action="{ record }">
        <TableAction
          :actions="[
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
        <a-button type="primary" @click="downloadFileTemplate">下载模板文件</a-button>
        <ImpExcel @success="impSuccess">
          <a-button type="primary">从excel上传</a-button>
        </ImpExcel>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #avatar="{ record }">
        <Image :src="record.avatar" :width="30" :height="30" />
      </template>
    </BasicTable>
    <UserModal @register="userModal" @success="handleSuccess" />
    <ExcelModal @register="excelModal" @confirm="confirmUpload" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ExcelData, ImpExcel } from '/@/components/Excel';
  import { Image } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { FormProps } from '/@/components/Form';
  import ExcelModal from '../ExcelModal.vue';
  import { ref } from 'vue';
  import {
    adminColumns,
    getAdminPage,
    uploadAdmin,
    downloadFileTemplate,
    AdminInfoModel,
  } from '../../../api/admin';
  import UserModal from './UserModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getCollegeList } from '/@/api/college';
  const { createMessage: message } = useMessage();
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
        field: 'clgCode',
        label: '学院',
        component: 'ApiSelect',
        colProps: {
          span: 6,
        },
        componentProps: {
          labelField: 'clgName',
          valueField: 'clgCode',
          api: getCollegeList,
        },
      },
      {
        field: 'adminName',
        label: '姓名',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: 'adminId',
        label: '工号',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
    ],
  };

  const [userModal, { openModal: openUserModal }] = useModal();
  const [excelModal, { openModal: openExcelModal }] = useModal();
  const [tableRef, { reload }] = useTable({
    api: getAdminPage,
    titleHelpMessage: '温馨提示',
    actionColumn,
    rowKey: 'userId',
    tableSetting: { fullScreen: true },
    formConfig,
    useSearchForm: true,
    showTableSetting: true,
    columns: adminColumns,
    showIndexColumn: false,
    title: tableTitle,
  });

  function handleCreate() {
    openUserModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: AdminInfoModel) {
    openUserModal(true, {
      record,
      isUpdate: true,
    });
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      message.warn('更新数据');
      console.log(values);
      // 演示不刷新表格直接更新内部数据。
      // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
      // const result = updateTableDataRecord(values.id, values);
      // console.log(result);
    } else {
      reload({ page: 1 });
    }
  }

  function handleDelete(record: AdminInfoModel) {
    console.log(record);
  }

  // function handleSelect(deptId = '') {
  //   searchInfo.deptId = deptId;
  //   reload();
  // }

  function impSuccess({ excelData, rawFile }) {
    openExcelModal(true, { excelDataList: excelData, file: rawFile });
  }

  async function confirmUpload(file: File) {
    const cnt = await uploadAdmin(file);
    message.success(`成功导入${cnt}条数据`);
    reload({ page: 1 });
  }
</script>

<style scoped lang="less">
  ::v-deep(td .ant-image .ant-image-img) {
    max-width: 30px;
    max-height: 30px;
  }

  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 5px !important;
  }
</style>
