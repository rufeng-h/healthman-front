<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:35:53
 * @LastEditTime: 2022-03-24 13:16:02
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <PageWrapper contentBackground dense contentFullHeight fixed-height>
    <BasicTable @register="registerTable">
      <template #id="{ record }">
        <Tag color="green">
          {{ record.clgCode }}
        </Tag>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '详情',
              onClick: handleView.bind(null, record),
            },
            // {
            //   icon: 'clarity:note-edit-line',
            //   tooltip: '编辑用户资料',
            //   onClick: handleEdit.bind(null, record),
            // },
            // {
            //   icon: 'ant-design:delete-outlined',
            //   color: 'error',
            //   tooltip: '删除此账号',
            //   popConfirm: {
            //     title: '是否确认删除',
            //     confirm: handleDelete.bind(null, record),
            //   },
            // },
          ]"
        />
      </template>
      <template #home="{ record }">
        <a-button type="primary" @click="openWindow(record.clgHome)">主页</a-button>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="downloadTemplate">下载模板文件</a-button>
        <ImpExcel @success="impSuccess">
          <a-button type="primary">导入数据</a-button>
        </ImpExcel>
      </template>
    </BasicTable>
    <ExcelModal @register="registerModal" @confirm="upload" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { BasicTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import {
    collegeColumns,
    getCollegeList,
    uploadCollege,
    downloadFileTemplate,
  } from '/@/api/college';
  import { useTable, TableAction } from '/@/components/Table';
  import { openWindow } from '/@/utils';
  import { ExcelData, ImpExcel } from '/@/components/Excel';
  import ExcelModal from '../ExcelModal.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  // const afterFetch = (data) => {
  //   data.forEach((college: CollegeModel) => {
  //     college.clgCode = college.clgCode.padStart(3, '0');
  //   });
  //   return data;
  // };
  const downloadTemplate = () => {
    downloadFileTemplate();
  };
  const [registerModal, { openModal }] = useModal();
  const impSuccess = (excelDataList: ExcelData[], file: File) => {
    openModal(true, { excelDataList, file });
  };
  const upload = async (file: File) => {
    const cnt = await uploadCollege(file);
    createMessage.success(`成功导入${cnt}条数据`);
    reload({ page: 1 });
  };
  const [registerTable, { reload }] = useTable({
    title: '学院信息',
    api: getCollegeList,
    columns: collegeColumns,
    titleHelpMessage: '温馨提示',
    bordered: true,
    striped: true,
    // afterFetch,
    showTableSetting: true,
    inset: true,
    rowKey: 'clgCode',
    tableSetting: { size: false, fullScreen: true },
    actionColumn: {
      title: '操作',
      slots: { customRender: 'action' },
      width: 50,
    },
  });
  const go = useGo();
  function handleView(record) {
    go(`/basedata/college/${record.clgCode}`);
  }
</script>

<style lang="less" scoped>
  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 8px !important;
  }
</style>
