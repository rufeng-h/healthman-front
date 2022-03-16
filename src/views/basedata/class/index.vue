<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:36:06
 * @LastEditTime: 2022-03-16 16:05:25
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <PageWrapper content-full-height dense content-background>
    <BasicTable
      @register="tableRef"
      :immediate="false"
      :api="getClassPage"
      :columns="classColumns"
      :title="tableTitle"
      show-table-setting
      title-help-message="温馨提示"
      use-search-form
      row-key="code"
      :form-config="formConfig"
      :table-setting="{ fullScreen: true }"
    >
      <template #code="{ record }">
        <Tag color="green">{{ record.code }}</Tag>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { FormProps } from '/@/components/Form';
  import { getClassPage, classColumns } from '/@/api/ptclass';
  import { reactive, ref, watch } from 'vue';
  import { getCollegeList, getCollegeInfo } from '/@/api/college';
  const tableTitle = ref('');
  type OptionsItem = { label: string; value: string; disabled?: boolean };
  const selectedId = ref('');
  const [tableRef, { getForm }] = useTable();
  const selectCompInfo: { grades: OptionsItem[]; majors: OptionsItem[] } = reactive({
    grades: [],
    majors: [],
  });
  watch(selectedId, async (curId) => {
    if (!curId) return;
    const data = await getCollegeInfo({ id: curId });

    /* 非响应式 */
    // selectCompInfo.grades = data.grades.map((v) => {
    // return { label: v.toString(), value: v.toString(), disabled: false };
    // });

    selectCompInfo.grades.length = 0;
    selectCompInfo.grades.push(
      ...data.grades.map((v) => {
        return { label: v.toString(), value: v.toString(), disabled: false };
      }),
    );

    /* 响应式 */
    selectCompInfo.majors.length = 0;
    selectCompInfo.majors.push(
      ...data.majors.map((v) => {
        return { label: v.name, value: v.code, disabled: false };
      }),
    );
  });
  // setTimeout(
  //   () => (selectCompInfo.grades = [{ label: '1234', value: '200', disabled: false }]),
  //   5000,
  // );
  const formConfig: FormProps = {
    submitOnReset: false,
    labelWidth: 80,
    showAdvancedButton: true,
    compact: true,
    schemas: [
      {
        field: 'collegeId',
        label: '学院',
        component: 'ApiSelect',
        colProps: {
          span: 6,
        },
        componentProps: {
          api: getCollegeList,
          immediate: true,
          labelField: 'name',
          valueField: 'id',
          showSearch: true,
          onSelect: (value: string, opt) => {
            getForm().setFieldsValue({ grade: undefined, majorCode: undefined });
            selectedId.value = value;
            tableTitle.value = opt.label;
          },
        },
        required: true,
      },
      {
        helpMessage: '请先选择学院',
        field: 'grade',
        label: '年级',
        component: 'Select',
        componentProps: {
          options: selectCompInfo.grades,
        },
        colProps: {
          span: 6,
        },
      },
      {
        helpMessage: '请先选择学院',
        field: 'majorCode',
        label: '专业',
        component: 'Select',
        componentProps: {
          options: selectCompInfo.majors,
        },
        colProps: {
          span: 6,
        },
      },
    ],
  };
</script>
