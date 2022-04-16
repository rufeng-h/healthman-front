<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:35:53
 * @LastEditTime: 2022-03-24 13:16:02
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <div>
    <PageWrapper contentBackground dense contentFullHeight>
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
              {
                icon: 'mdi:database-import',
                tooltip: '导入班级数据',
                onClick: handleImpCls.bind(null, record),
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
          <ImpExcel @success="impSuccess" ref="impExcel">
            <a-button type="primary">导入学院数据</a-button>
          </ImpExcel>
        </template>
      </BasicTable>
      <ExcelModal @register="registerModal" @confirm="upload" @cancel="cancelUpload" />
    </PageWrapper>
  </div>
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
    CollegeModel,
  } from '/@/api/college';
  import { useTable, TableAction } from '/@/components/Table';
  import { openWindow } from '/@/utils';
  import { ImpExcel } from '/@/components/Excel';
  import ExcelModal from '../ExcelModal.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ref, unref } from 'vue';
  import { uploadClass } from '/@/api/ptclass';
  import { useLoading } from '/@/components/Loading';
  const { createMessage } = useMessage();
  const impExcel = ref();
  let curUploadClg: Nullable<CollegeModel> = null;
  const [openFullLoading, closeFullLoading] = useLoading({
    tip: '请稍后...',
  });
  const downloadTemplate = async () => {
    try {
      openFullLoading();
      await downloadFileTemplate();
    } finally {
      closeFullLoading();
    }
  };
  const [registerModal, { openModal }] = useModal();
  const impSuccess = ({ excelDataList, file }) => {
    openModal(true, { excelDataList, file });
  };
  const upload = async (file: File) => {
    try {
      openFullLoading();
      let cnt = 0;
      /* 正在上传指定学院的班级数据 */
      if (curUploadClg !== null) {
        cnt = await uploadClass(file, curUploadClg.clgCode);
      } else {
        /* 上传学院数据 */
        cnt = await uploadCollege(file);
      }
      closeFullLoading();
      createMessage.success(`成功导入${cnt}条数据`);
      reload({ page: 1 });
    } catch (e) {
      closeFullLoading();
      throw e;
    } finally {
      curUploadClg = null;
    }
  };
  const [registerTable, { reload }] = useTable({
    title: '学院信息',
    api: getCollegeList,
    columns: collegeColumns,
    titleHelpMessage: '温馨提示',
    bordered: true,
    striped: true,
    showTableSetting: true,
    inset: true,
    rowKey: 'clgCode',
    tableSetting: { size: false, fullScreen: true },
  });
  function handleImpCls(record) {
    curUploadClg = record;
    unref(impExcel).handleUpload();
  }
  function cancelUpload() {
    curUploadClg = null;
  }
  const go = useGo();
  function handleView(record) {
    go({
      // @ts-ignore
      name: 'BaseDataCollegeDetail',
      params: { clgCode: record.clgCode },
    });
  }
</script>

<style lang="less" scoped>
  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 8px !important;
  }
</style>
