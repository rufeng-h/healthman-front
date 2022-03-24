<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:36:06
 * @LastEditTime: 2022-03-23 14:13:36
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <PageWrapper content-full-height dense content-background>
    <BasicTable @register="tableRef">
      <template #code="{ record }">
        <Tag color="green">{{ record.clsCode }}</Tag>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="downloadFileTemplate">下载模板</a-button>
        <ImpExcel @success="impSuccess">
          <a-button type="primary">导入数据</a-button>
        </ImpExcel>
      </template>
    </BasicTable>
    <ExcelModal @confirm="confirmUpload" @register="registerModal" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { ExcelData, ImpExcel } from '/@/components/Excel';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { FormProps } from '/@/components/Form';
  import {
    getClassPage,
    classColumns,
    getGradeList,
    downloadFileTemplate,
    uploadClass,
  } from '/@/api/ptclass';
  import { onMounted, Ref, ref } from 'vue';
  import { getCollegeList } from '/@/api/college';
  import ExcelModal from '../ExcelModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  const tableTitle = ref('');
  const { createMessage } = useMessage();
  type OptionsItem = { label: string; value: string; disabled?: boolean };
  const grades: Ref<OptionsItem[]> = ref<OptionsItem[]>([]);
  const fetchGrades = async (clgCode: string | undefined = undefined) => {
    grades.value.length = 0;
    const gs: number[] = await getGradeList({ clgCode });
    grades.value.push(
      ...gs.map((g) => {
        return {
          label: g.toString(),
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
            getForm().setFieldsValue({ grade: undefined });
            fetchGrades(value);
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
    rowKey: 'clsId',
    formConfig: formConfig,
    tableSetting: { fullScreen: true, size: false },
  });

  const [registerModal, { openModal }] = useModal();
  const impSuccess = (excelDataList: ExcelData[], file: File) => {
    openModal(true, { excelDataList, file });
  };
  const confirmUpload = async (file: File) => {
    const cnt = await uploadClass(file);
    createMessage.success(`成功导入${cnt}条数据`);
    reload({ page: 1 });
  };
</script>
