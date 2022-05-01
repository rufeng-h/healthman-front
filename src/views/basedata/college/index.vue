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
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除学院',
                popConfirm: {
                  title: '请先确认删除了所有的教师、班级，才能执行此操作！是否继续？',
                  confirm: handleDelete.bind(null, record),
                },
                ifShow: () => hasPermission(COLLEGE_DELETE),
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑学院',
                onClick: handleEdit.bind(null, record),
                ifShow: () => hasPermission(COLLEGE_UPDATE),
              },
              {
                icon: 'clarity:info-standard-line',
                tooltip: '详情',
                onClick: handleView.bind(null, record),
                ifShow: () => hasPermission(COLLEGE_GET),
              },
              {
                icon: 'mdi:database-import',
                tooltip: '导入班级数据',
                onClick: handleImpCls.bind(null, record),
                ifShow: () => hasPermission(CLASS_UPLOAD),
              },
            ]"
          />
        </template>
        <template #home="{ record }">
          <a-button type="primary" @click="openWindow(record.clgHome)">主页</a-button>
        </template>
        <template #toolbar>
          <a-button type="primary" @click="downloadTemplate" v-if="hasPermission(COLLEGE_TEMPLATE)"
            >下载模板文件</a-button
          >
          <ImpExcel @success="impSuccess" ref="impExcel">
            <a-button v-if="hasPermission(COLLEGE_UPLOAD)" type="primary">导入学院数据</a-button>
          </ImpExcel>
        </template>
      </BasicTable>
      <ExcelModal
        v-if="hasPermission(COLLEGE_UPLOAD) || hasPermission(CLASS_UPLOAD)"
        @register="excelModal"
        @confirm="upload"
        @cancel="cancelUpload"
      />
      <CollegeModal
        v-if="hasPermission(COLLEGE_UPLOAD)"
        @register="collegeModal"
        @submit="handleUpdate"
      />
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { Tag } from 'ant-design-vue';
  import { BasicTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import {
    collegeColumns,
    pageCollege,
    uploadCollege,
    downloadFileTemplate,
    CollegeModel,
    CollegeInfoModel,
    deleteCollege,
    CollegeUpdateFormdata,
    updateCollege,
  } from '/@/api/college';
  import { useTable, TableAction } from '/@/components/Table';
  import { openWindow } from '/@/utils';
  import { ImpExcel } from '/@/components/Excel';
  import ExcelModal from '../ExcelModal.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defineComponent, ref, unref } from 'vue';
  import { uploadClass } from '/@/api/ptclass';
  import { useLoading } from '/@/components/Loading';
  import { ROUTENAMES } from '/@/router/routes/routeMapping';
  import { usePermission } from '/@/hooks/web/usePermission';
  import {
    COLLEGE_TEMPLATE,
    COLLEGE_UPLOAD,
    CLASS_UPLOAD,
    COLLEGE_GET,
    COLLEGE_DELETE,
    COLLEGE_UPDATE,
  } from '/@/store/modules/Authority';
  import CollegeModal from './CollegeModal.vue';
  export default defineComponent({
    components: {
      ExcelModal,
      Tag,
      BasicTable,
      TableAction,
      PageWrapper,
      ImpExcel,
      CollegeModal,
    },
    setup() {
      const { createMessage } = useMessage();
      const { hasPermission } = usePermission();

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
      const [excelModal, { openModal: openExcelModal }] = useModal();
      const [collegeModal, { openModal: openCollegeModal }] = useModal();
      const impSuccess = ({ excelDataList, file }) => {
        openExcelModal(true, { excelDataList, file });
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
        api: pageCollege,
        columns: collegeColumns,
        titleHelpMessage: '温馨提示',
        bordered: true,
        striped: true,
        showTableSetting: true,
        inset: true,
        rowKey: 'clgCode',
        indexColumnProps: {
          dataIndex: '',
          title: '序号',
        },
        tableSetting: { size: false, fullScreen: true },
      });
      function handleImpCls(record) {
        curUploadClg = record;
        unref(impExcel).handleUpload();
      }
      function cancelUpload() {
        curUploadClg = null;
      }
      function handleEdit(record: CollegeInfoModel) {
        openCollegeModal(true, record);
      }
      const go = useGo();
      function handleView(record) {
        go({
          // @ts-ignore
          name: ROUTENAMES.BASEDATA.COLLEGE_DETAIL,
          params: { clgCode: record.clgCode },
        });
      }
      async function handleUpdate(values: CollegeUpdateFormdata) {
        try {
          openFullLoading();
          if (await updateCollege(values)) {
            createMessage.success('更新成功！');
            reload();
          }
        } finally {
          closeFullLoading();
        }
      }
      async function handleDelete(record: CollegeInfoModel) {
        try {
          openFullLoading();
          const success = await deleteCollege(record.clgCode);
          if (success) {
            createMessage.success('删除成功！');
          }
        } finally {
          closeFullLoading();
        }
      }
      return {
        registerTable,
        excelModal,
        collegeModal,
        handleImpCls,
        cancelUpload,
        handleView,
        downloadTemplate,
        impSuccess,
        handleDelete,
        handleUpdate,
        openWindow,
        upload,
        handleEdit,

        hasPermission,
        COLLEGE_TEMPLATE,
        COLLEGE_UPLOAD,
        CLASS_UPLOAD,
        COLLEGE_GET,
        COLLEGE_DELETE,
        COLLEGE_UPDATE,
      };
    },
  });
</script>

<style lang="less" scoped>
  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 8px !important;
  }
</style>
