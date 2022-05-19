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
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '请确认该教师不关联其他资源，否则删除失败！是否继续？',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              ifShow: () => hasPermission(TEACHER_DELETE),
            },
            {
              icon: 'simple-icons:auth0',
              color: 'success',
              tooltip: '分配角色',
              ifShow: () => hasPermission(TEACHER_UPDATE),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑教师信息',
              onClick: handleEdit.bind(null, record),
              ifShow: () => hasPermission(TEACHER_UPDATE),
            },
            {
              icon: 'material-symbols:lock-reset-sharp',
              tooltip: '重置密码',
              popConfirm: {
                title: '重置密码？',
                confirm: resetPwd.bind(null, record),
              },
              ifShow: () => hasPermission(TEACHER_PWDRESET),
            },
            {
              icon: 'clarity:info-standard-line',
              tooltip: '详情',
              onClick: handleView.bind(null, record),
              ifShow: () => hasPermission(TEACHER_GET),
            },
          ]"
        />
      </template>
      <template #toolbar>
        <a-button
          type="primary"
          pre-icon="akar-icons:cloud-download"
          @click="downloadFileTemplate"
          v-if="hasPermission(TEACHER_TEMPLATE)"
          >下载模板文件</a-button
        >
        <ImpExcel @success="impSuccess">
          <a-button
            pre-icon="akar-icons:cloud-upload"
            type="primary"
            v-if="hasPermission(TEACHER_UPLOAD)"
            >从excel上传</a-button
          >
        </ImpExcel>
      </template>
      <template #avatar="{ record }">
        <Image :src="record.avatar" :width="30" :height="30" />
      </template>
      <template #principal="{ record }">
        <Tooltip v-if="record.principal" title="负责人"
          ><Icon icon="ant-design:user-outlined"
        /></Tooltip>
        <Tooltip v-else title="教职工"><Icon icon="akar-icons:people-group" /></Tooltip>
      </template>
      <template #gender="{ record }">
        <Icon v-if="record.teaGender === 'M'" icon="twemoji:male-sign" />
        <Icon v-else icon="twemoji:female-sign" />
      </template>
    </BasicTable>
    <ExcelModal @register="excelModal" @confirm="confirmUpload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { FormProps } from '/@/components/Form';
  import { defineComponent, ref } from 'vue';
  import {
    teaColumns,
    pageTeacher,
    uploadAdmin,
    downloadTemplate,
    TeacherInfoModel,
    resetTeaPwd,
    deleteTeacher,
  } from '/@/api/teacher';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getCollegeList } from '/@/api/college';
  import { useLoading } from '/@/components/Loading';
  import Icon from '/@/components/Icon';
  import ExcelModal from '../ExcelModal.vue';
  import { ImpExcel } from '/@/components/Excel';
  import { Image } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import {
    TEACHER_TEMPLATE,
    TEACHER_UPLOAD,
    TEACHER_DELETE,
    TEACHER_PWDRESET,
    TEACHER_GET,
    TEACHER_UPDATE,
  } from '/@/store/modules/authority';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Tooltip } from 'ant-design-vue';
  export default defineComponent({
    components: {
      Icon,
      ExcelModal,
      Image,
      PageWrapper,
      BasicTable,
      TableAction,
      ImpExcel,
      Tooltip,
    },
    setup() {
      const { createMessage: message } = useMessage();
      const { hasPermission } = usePermission();
      const tableTitle = ref('教师信息');
      const formConfig: FormProps = {
        submitOnReset: true,
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
            field: 'teaName',
            label: '姓名',
            component: 'Input',
            colProps: {
              span: 6,
            },
          },
          {
            field: 'teaId',
            label: '工号',
            component: 'Input',
            colProps: {
              span: 6,
            },
          },
        ],
      };
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '请稍后...',
      });
      const [excelModal, { openModal: openExcelModal }] = useModal();
      const [tableRef, { reload }] = useTable({
        api: pageTeacher,
        titleHelpMessage: '温馨提示',
        rowKey: 'teaId',
        tableSetting: { fullScreen: true },
        formConfig,
        useSearchForm: true,
        showTableSetting: true,
        columns: teaColumns,
        title: tableTitle,
        indexColumnProps: {
          dataIndex: '',
          title: '序号',
        },
      });

      async function handleDelete(record: TeacherInfoModel) {
        try {
          openFullLoading();
          if (await deleteTeacher(record.teaId)) {
            message.success('删除成功！');
          }
        } finally {
          closeFullLoading();
        }
      }

      function impSuccess({ excelDataList, file }) {
        openExcelModal(true, { excelDataList, file });
      }

      async function resetPwd(record: TeacherInfoModel) {
        try {
          openFullLoading();
          if (await resetTeaPwd(record.teaId)) {
            message.success('操作成功！');
          }
        } finally {
          closeFullLoading();
        }
      }

      async function confirmUpload(file: File) {
        try {
          openFullLoading();
          const cnt = await uploadAdmin(file);
          message.success(`成功导入${cnt}条数据`);
          await reload({ page: 1 });
        } finally {
          closeFullLoading();
        }
      }

      async function downloadFileTemplate() {
        try {
          openFullLoading();
          await downloadTemplate();
        } finally {
          closeFullLoading();
        }
      }
      function handleView() {}
      function handleEdit() {}
      return {
        handleView,
        handleEdit,
        excelModal,
        tableRef,
        downloadFileTemplate,
        confirmUpload,
        handleDelete,
        impSuccess,
        resetPwd,
        TEACHER_DELETE,
        TEACHER_PWDRESET,
        TEACHER_TEMPLATE,
        TEACHER_UPLOAD,
        TEACHER_GET,
        TEACHER_UPDATE,
        hasPermission,
      };
    },
  });
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
