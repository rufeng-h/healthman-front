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
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此学生信息',
              popConfirm: {
                title: '该操作将会删除学生的所有信息，确认执行？',
                confirm: handleDelete.bind(null, record),
              },
              ifShow: () => hasPermission(STUDENT_DELETE),
            },
            {
              icon: 'material-symbols:lock-reset-sharp',
              tooltip: '重置密码',
              popConfirm: {
                title: '重置密码？',
                confirm: resetPwd.bind(null, record),
              },
              ifShow: () => hasPermission(STUDENT_PWDRESET),
            },
            {
              icon: 'clarity:info-standard-line',
              tooltip: '详情',
              onClick: handleView.bind(null, record),
              ifShow: () => hasPermission(STUDENT_GET),
            },
          ]"
        />
      </template>

      <template #toolbar>
        <a-button type="primary" @click="downloadTemplate" v-if="hasPermission(STUDENT_TEMPLATE)"
          >下载模板</a-button
        >
        <ImpExcel
          @success="impSuccess"
          dateFormat="yyyy-MM-DD"
          v-if="hasPermission(STUDENT_UPLOAD)"
        >
          <a-button type="primary">导入数据</a-button>
        </ImpExcel>
      </template>
    </BasicTable>
    <ExcelModal @confirm="confirmUpload" @register="registerModal" />
  </PageWrapper>
</template>

<script lang="ts">
  import {
    studentColumns,
    getStudentPage,
    StudentQuery,
    downloadFileTemplate,
    uploadStudent,
    StudentInfoModel,
    deleteStudent,
    resetStuPwd,
  } from '/@/api/student';
  import { ref, Ref, defineComponent } from 'vue';
  import { FormProps } from '/@/components/Form';
  import OrderEnum from '/@/enums/orderEnum';
  import { getCollegeList } from '/@/api/college';
  import { getClassList } from '/@/api/ptclass';
  import { isArray } from '/@/utils/is';
  import { useModal } from '/@/components/Modal';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useLoading } from '/@/components/Loading';
  import { ROUTENAMES } from '/@/router/routes/routeMapping';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Icon } from '/@/components/Icon';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Image, Tag } from 'ant-design-vue';
  import { ImpExcel } from '/@/components/Excel';
  import ExcelModal from '../ExcelModal.vue';
  import {
    STUDENT_UPLOAD,
    STUDENT_TEMPLATE,
    STUDENT_GET,
    STUDENT_DELETE,
    STUDENT_PWDRESET,
  } from '/@/store/modules/authority';
  export default defineComponent({
    components: {
      ImpExcel,
      ExcelModal,
      Icon,
      PageWrapper,
      BasicTable,
      TableAction,
      Image,
      Tag,
    },
    setup() {
      const tableTitle = ref('未选择班级');
      const { createMessage } = useMessage();
      const { hasPermission } = usePermission();

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
              onSelect: async (value: string) => {
                await getForm().setFieldsValue({ clsCode: undefined });
                await fetchClass(value);
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
          if (order === OrderEnum.desc) {
            params.order = OrderEnum.DESC;
          } else if (order === OrderEnum.asc) {
            params.order = OrderEnum.ASC;
          } else {
            console.warn(`排序异常 ${field} ${order}`);
            throw new Error();
          }
        } else if (field || order) {
          console.warn('请求参数异常' + field + ' ' + order);
          throw new Error();
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
        tableSetting: { fullScreen: true, size: false },
        beforeFetch,
        inset: true,
        useSearchForm: true,
        formConfig,
        canResize: true,
        autoCreateKey: true,
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
            await reload();
          }
        } finally {
          closeFullLoading();
        }
      };
      async function handleDelete(record: StudentInfoModel) {
        try {
          openFullLoading();
          if (await deleteStudent(record.stuId)) {
            createMessage.success('删除成功！');
            reload();
          }
        } finally {
          closeFullLoading();
        }
      }
      async function downloadTemplate() {
        try {
          openFullLoading();
          await downloadFileTemplate();
        } finally {
          closeFullLoading();
        }
      }
      async function resetPwd(record: StudentInfoModel) {
        try {
          openFullLoading();
          if (await resetStuPwd(record.stuId)) {
            createMessage.success('操作成功！');
          }
        } finally {
          closeFullLoading();
        }
      }
      const go = useGo();
      function handleView(record) {
        go({
          // @ts-ignore
          name: ROUTENAMES.BASEDATA.STUDENT_DETAIL,
          params: {
            stuId: record.stuId,
          },
        });
      }
      return {
        registerModal,
        tableRef,

        resetPwd,
        handleView,
        handleDelete,
        downloadTemplate,
        confirmUpload,
        impSuccess,

        STUDENT_UPLOAD,
        STUDENT_TEMPLATE,
        STUDENT_GET,
        STUDENT_DELETE,
        STUDENT_PWDRESET,
        hasPermission,
      };
    },
  });
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
