<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:36:06
 * @LastEditTime: 2022-03-24 18:35:50
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <PageWrapper content-full-height dense content-background>
    <BasicTable @register="tableRef">
      <template #code="{ record }">
        <Tag color="green">{{ record.clsCode }}</Tag>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '详情',
              onClick: handleView.bind(null, record),
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
    <ExcelModal @confirm="confirmUpload" @register="registerModal" />
  </PageWrapper>
</template>
<script lang="ts">
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { FormProps } from '/@/components/Form';
  import {
    classColumns,
    downloadTemplate,
    getClassPage,
    getGradeList,
    uploadClass,
  } from '/@/api/ptclass';
  import { defineComponent, onMounted, ref, Ref } from 'vue';
  import { getCollegeList } from '/@/api/college';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useLoading } from '/@/components/Loading';
  import { numberGradeToZhcn } from '/@/enums/gradeEnum';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { CLASS_TEMPLATE, CLASS_UPLOAD } from '/@/store/modules/Authority';
  import { ROUTENAMES } from '/@/router/routes/routeMapping';
  import { PageWrapper } from '/@/components/Page';
  import ExcelModal from '/@/views/basedata/ExcelModal.vue';
  import { ImpExcel } from '/@/components/Excel';
  import { Tag } from 'ant-design-vue';

  export default defineComponent({
    components: {
      PageWrapper,
      BasicTable,
      ExcelModal,
      ImpExcel,
      TableAction,
      Tag,
    },
    setup() {
      const tableTitle = ref('');
      const { hasPermission } = usePermission();
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '请稍后...',
      });
      const { createMessage } = useMessage();
      type OptionsItem = { label: string; value: string; disabled?: boolean };
      const grades: Ref<OptionsItem[]> = ref<OptionsItem[]>([]);
      const fetchGrades = async (clgCode: string | undefined = undefined) => {
        grades.value.length = 0;
        const gs: number[] = await getGradeList(clgCode);
        grades.value.push(
          ...gs.map((g) => {
            return {
              label: numberGradeToZhcn(g),
              value: g.toString(),
            };
          }),
        );
      };
      onMounted(() => {
        fetchGrades();
      });

      const formConfig: FormProps = {
        submitOnReset: false,
        labelWidth: 80,
        showAdvancedButton: true,
        compact: true,
        schemas: [
          {
            field: 'clgCode',
            label: '学院',
            component: 'ApiSelect',
            colProps: {
              span: 8,
            },
            componentProps: {
              api: getCollegeList,
              immediate: true,
              labelField: 'clgName',
              valueField: 'clgCode',
              showSearch: true,
              onSelect: async (value: string, opt) => {
                await getForm().setFieldsValue({ grade: undefined });
                await fetchGrades(value);
                tableTitle.value = opt.label;
              },
            },
          },
          {
            field: 'grade',
            label: '年级',
            component: 'Select',
            componentProps: {
              options: grades.value,
            },
            colProps: {
              span: 8,
            },
          },
        ],
      };
      const [tableRef, { getForm, reload }] = useTable({
        api: getClassPage,
        title: tableTitle,
        columns: classColumns,
        showTableSetting: true,
        titleHelpMessage: '温馨提示',
        useSearchForm: true,
        rowKey: 'clsCode',
        formConfig: formConfig,
        showIndexColumn: false,
        tableSetting: { fullScreen: true },
      });

      const [registerModal, { openModal }] = useModal();
      const impSuccess = ({ excelDataList, file }) => {
        openModal(true, { excelDataList, file });
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
        registerModal,
        handleView,
        downloadFileTemplate,
        confirmUpload,
        impSuccess,

        CLASS_TEMPLATE,
        CLASS_UPLOAD,
        hasPermission,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 0.5rem !important;
  }
</style>
