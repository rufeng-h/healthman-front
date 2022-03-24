<template>
  <PageWrapper content-full-height dense content-background>
    <BasicTable @register="tableRef" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { scoreSheetColumns, getScoreSheetList, ScoreSheetQuery } from '/@/api/scoreSheet';
  import { getSubjectList } from '/@/api/subject';
  import { ref } from 'vue';
  import { FormProps } from '/@/components/Form';
  const query: ScoreSheetQuery = { subjectId: undefined, gender: undefined };
  const form: FormProps = {
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
          api: getSubjectList,
          immediate: true,
          labelField: 'name',
          valueField: 'id',
          showSearch: false,
          onSelect: (key: number, opt) => {
            tableTitle.value = opt.label;
            query.subjectId = key;
          },
        },
        required: true,
      },
      {
        field: 'gender',
        label: '性别',
        component: 'Select',
        colProps: {
          span: 8,
        },
        componentProps: {
          defaultActiveFirstOption: true,
          options: [
            { label: '男', value: 'M' },
            { label: '女', value: 'F' },
          ],
          onSelect(gender) {
            query.gender = gender;
          },
        },
        required: true,
      },
    ],
  };
  const beforeFetch = (params: ScoreSheetQuery) => {
    Object.assign(params, query);
    return params;
  };
  const tableTitle = ref('选择科目');
  const [tableRef, _] = useTable({
    columns: scoreSheetColumns,
    rowKey: 'id',
    striped: true,
    pagination: false,
    api: getScoreSheetList,
    immediate: false,
    showTableSetting: true,
    showIndexColumn: false,
    tableSetting: { fullScreen: true },
    useSearchForm: true,
    formConfig: form,
    title: tableTitle,
    titleHelpMessage: '温馨提示',
    bordered: true,
    beforeFetch: beforeFetch,
  });
</script>
