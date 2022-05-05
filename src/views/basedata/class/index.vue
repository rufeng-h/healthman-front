<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:36:06
 * @LastEditTime: 2022-03-24 18:35:50
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <div>
    <PageWrapper content-full-height dense content-background>
      <BasicTable @register="tableRef">
        <template #code="{ record }">
          <Tag color="green">{{ record.clsCode }}</Tag>
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此班级',
                popConfirm: {
                  title: '该操作将会删除班级下的所有数据（学生、体测成绩等），确认执行？',
                  confirm: handleDelete.bind(null, record),
                },
                ifShow: () => hasPermission(CLASS_DELETE),
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
                ifShow: () => hasPermission(CLASS_UPDATE),
              },
              {
                icon: 'clarity:info-standard-line',
                tooltip: '详情',
                onClick: handleView.bind(null, record),
                ifShow: () => hasPermission(CLASS_GET),
              },
            ]"
          />
        </template>
        <template #toolbar>
          <a-button
            type="primary"
            v-if="hasPermission(CLASS_TEMPLATE)"
            @click="downloadFileTemplate"
            pre-icon="akar-icons:cloud-download"
            >下载模板
          </a-button>
          <ImpExcel @success="impSuccess" v-if="hasPermission(CLASS_UPLOAD)">
            <a-button pre-icon="akar-icons:cloud-upload" type="primary">导入数据</a-button>
          </ImpExcel>
        </template>
      </BasicTable>
      <ExcelModal
        v-if="hasPermission(CLASS_UPLOAD)"
        @confirm="confirmUpload"
        @register="excelModal"
      />
      <ClassModal
        v-if="hasPermission(CLASS_UPDATE)"
        @submit="handleUpdate"
        @register="classModal"
      />
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { FormProps } from '/@/components/Form';
  import {
    classColumns,
    ClassInfoModel,
    deletePtClass,
    downloadTemplate,
    getClassPage,
    updatePtClass,
    UpdatePtClassFormdata,
    uploadClass,
  } from '/@/api/ptclass';
  import { defineComponent, ref } from 'vue';
  import { getCollegeList } from '/@/api/college';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useLoading } from '/@/components/Loading';
  import { usePermission } from '/@/hooks/web/usePermission';
  import {
    CLASS_TEMPLATE,
    CLASS_UPLOAD,
    CLASS_DELETE,
    CLASS_GET,
    CLASS_UPDATE,
  } from '/@/store/modules/Authority';
  import { ROUTENAMES } from '/@/router/routes/routeMapping';
  import { PageWrapper } from '/@/components/Page';
  import ExcelModal from '/@/views/basedata/ExcelModal.vue';
  import ClassModal from './ClassModal.vue';
  import { ImpExcel } from '/@/components/Excel';
  import { Tag } from 'ant-design-vue';
  import { gradeOptions } from '/@/enums/gradeEnum';

  export default defineComponent({
    components: {
      PageWrapper,
      BasicTable,
      ExcelModal,
      ImpExcel,
      TableAction,
      Tag,
      ClassModal,
    },
    setup() {
      const tableTitle = ref('');
      const { hasPermission } = usePermission();
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '请稍后...',
      });
      const { createMessage } = useMessage();
      const formConfig: FormProps = {
        submitOnReset: true,
        labelWidth: 80,
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
              api: getCollegeList,
              immediate: true,
              labelField: 'clgName',
              valueField: 'clgCode',
              showSearch: true,
              onSelect: async (_: string, opt) => {
                tableTitle.value = opt.label;
              },
            },
          },
          {
            field: 'grade',
            label: '年级',
            colProps: {
              span: 6,
            },
            component: 'Select',
            componentProps: {
              options: gradeOptions,
            },
          },
          {
            field: 'clsName',
            label: '班级名称',
            component: 'Input',
            componentProps: {
              placeholder: '输入班级名称',
            },
            colProps: {
              span: 6,
            },
          },
        ],
      };
      const [tableRef, { reload }] = useTable({
        api: getClassPage,
        title: tableTitle,
        columns: classColumns,
        showTableSetting: true,
        titleHelpMessage: '温馨提示',
        useSearchForm: true,
        rowKey: 'clsCode',
        formConfig: formConfig,
        showIndexColumn: true,
        indexColumnProps: {
          dataIndex: '',
          title: '序号',
        },
        tableSetting: { fullScreen: true },
      });

      const [excelModal, { openModal: openExcelModal }] = useModal();
      const [classModal, { openModal: openClassModal }] = useModal();
      const impSuccess = ({ excelDataList, file }) => {
        openExcelModal(true, { excelDataList, file });
      };
      const confirmUpload = async (file: File) => {
        try {
          openFullLoading();
          const cnt = await uploadClass(file);
          closeFullLoading();
          createMessage.success(`成功导入${cnt}条数据`);
          await reload({ page: 1 });
        } catch (e) {
          closeFullLoading();
          throw e;
        }
      };

      async function handleDelete(record: ClassInfoModel) {
        try {
          openFullLoading();
          const success = await deletePtClass(record.clsCode);
          if (success) {
            createMessage.success('操作成功！');
            await reload({ page: 1 });
          }
        } finally {
          closeFullLoading();
        }
      }

      async function handleUpdate(data: UpdatePtClassFormdata) {
        try {
          openFullLoading();
          const success = await updatePtClass(data);
          if (success) {
            createMessage.success('更新班级信息成功！');
            await reload({ page: 1 });
          }
        } finally {
          closeFullLoading();
        }
      }

      function handleEdit(record: ClassInfoModel) {
        openClassModal(true, record);
      }

      async function downloadFileTemplate() {
        try {
          openFullLoading();
          await downloadTemplate();
        } finally {
          closeFullLoading();
        }
      }

      const go = useGo();

      function handleView(record) {
        go({
          //@ts-ignore
          name: ROUTENAMES.BASEDATA.CLASS_DETAIL,
          params: {
            clsCode: record.clsCode,
          },
        });
      }

      return {
        tableRef,
        excelModal,
        classModal,
        handleView,
        handleDelete,
        handleUpdate,
        handleEdit,
        downloadFileTemplate,
        confirmUpload,
        impSuccess,

        CLASS_TEMPLATE,
        CLASS_UPLOAD,
        CLASS_DELETE,
        CLASS_GET,
        CLASS_UPDATE,
        hasPermission,
      };
    },
  });
</script>
<style lang="less" scoped>
  // ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
  //   padding: 0.5rem !important;
  // }
</style>
