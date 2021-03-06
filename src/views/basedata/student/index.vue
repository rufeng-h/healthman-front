<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-14 10:37:19
 * @LastEditTime: 2022-03-24 18:30:50
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <PageWrapper content-full-height dense content-background fixed-height>
    <BasicTable @register="tableRef">
      <template #gender="{ record }">
        <Icon v-if="record.stuGender === 'M'" icon="twemoji:male-sign" />
        <Icon v-else icon="twemoji:female-sign" />
      </template>

      <template #avatar="{ record }">
        <Image :src="record.avatar" :height="30" :width="30" />
      </template>

      <template #number="{ record }">
        <Tag color="green">{{ record.stuId }}</Tag>
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
        <a-button type="primary" @click="downloadTemplate">下载模板</a-button>
        <ImpExcel @success="impSuccess" dateFormat="yyyy-MM-DD">
          <a-button type="primary">导入数据</a-button>
        </ImpExcel>
      </template>
    </BasicTable>
    <ExcelModal @confirm="confirmUpload" @register="registerModal" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { Icon } from '/@/components/Icon';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Image, Tag } from 'ant-design-vue';
  import {
    studentColumns,
    getStudentPage,
    StudentQuery,
    downloadFileTemplate,
    uploadStudent,
  } from '/@/api/student';
  import { ref, Ref } from 'vue';
  import { FormProps } from '/@/components/Form';
  import OrderEnum from '../../../enums/orderEnum';
  import { getCollegeList } from '/@/api/college';
  import { getClassList } from '/@/api/ptclass';
  import { isArray } from '/@/utils/is';
  import { ImpExcel } from '/@/components/Excel';
  import ExcelModal from '../ExcelModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useLoading } from '/@/components/Loading';
  const tableTitle = ref('未选择班级');
  const { createMessage } = useMessage();

  const fetchClass = async (clgCode: string | undefined = undefined) => {
    const data = await getClassList({ clgCode });
    classes.value.length = 0;
    classes.value.push(
      ...data.map((item) => {
        return {
          value: item.clsCode,
          label: item.clsName,
        };
      }),
    );
  };
  type OptionsItem = { label: string; value: string; disabled?: boolean };
  const classes: Ref<OptionsItem[]> = ref([]);
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
          span: 6,
        },
        componentProps: {
          api: getCollegeList,
          immediate: true,
          labelField: 'clgName',
          valueField: 'clgCode',
          showSearch: true,
          onSelect: async (value: string) => {
            getForm().setFieldsValue({ clsCode: undefined });
            fetchClass(value);
          },
        },
      },
      {
        field: 'clsCode',
        label: '班级',
        component: 'Select',
        componentProps: {
          options: classes.value,
          onSelect(_, option: OptionsItem) {
            tableTitle.value = option.label;
          },
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'stuName',
        label: '姓名',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: 'stuId',
        label: '学号',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
    ],
  };

  const [openFullLoading, closeFullLoading] = useLoading({
    tip: '正在上传...',
  });

  const beforeFetch = (params: StudentQuery) => {
    const { field, order } = params;
    if (field && order) {
      if (order === 'descend') {
        params.order = OrderEnum.DESC;
      } else if (order === 'ascend') {
        params.order = OrderEnum.ASC;
      } else {
        throw new Error('order参数异常 => ' + order);
      }
    } else if (field || order) {
      throw new Error('请求参数异常' + field + ' ' + order);
    }
    if (params.stuGender && isArray(params.stuGender)) {
      params.stuGender = params.stuGender[0];
    }
    return params;
  };
  const [tableRef, { getForm, reload }] = useTable({
    bordered: true,
    title: tableTitle,
    columns: studentColumns,
    api: getStudentPage,
    showTableSetting: true,
    // immediate: false,
    tableSetting: { fullScreen: true, size: false },
    beforeFetch,
    inset: true,
    useSearchForm: true,
    formConfig,
    canResize: true,
    actionColumn: {
      title: '操作',
      width: 50,
      slots: { customRender: 'action' },
    },
  });
  const [registerModal, { openModal }] = useModal();
  const impSuccess = ({ excelDataList, file }) => {
    openModal(true, { excelDataList, file });
  };
  const confirmUpload = async (file: File) => {
    try {
      openFullLoading();
      const data = await uploadStudent(file);
      if (data) {
        createMessage.success(`成功添加${data}条记录!`);
        reload();
      }
    } finally {
      closeFullLoading();
    }
  };
  async function downloadTemplate() {
    try {
      openFullLoading();
      downloadFileTemplate();
    } finally {
      closeFullLoading();
    }
  }
  const go = useGo();
  function handleView(record) {
    go({
      // @ts-ignore
      name: 'BaseDataStudentDetail',
      params: {
        stuId: record.stuId,
      },
    });
  }
</script>

<style lang="less" scoped>
  ::v-deep(td .ant-image .ant-image-img) {
    max-width: 30px;
    max-height: 30px;
  }

  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 5px !important;
  }
</style>
