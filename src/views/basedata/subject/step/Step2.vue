<template>
  <div class="w-4/5" style="margin: auto">
    <Alert
      class="m-2"
      message="默认包含下限，但不包含上限，若无上限或者下限，可不填。例如20个及以上引体向上为满分，下限20，上限不填"
      show-icon
    />

    <BasicTable @register="registerTable">
      <template #action="{ record, column }">
        <TableAction :actions="createActions(record, column)" />
      </template>
      <template #toolbar>
        <ImpExcel>
          <a-button>从excel导入</a-button>
        </ImpExcel>
      </template>
      <template #footer>
        <Row type="flex" justify="center" class="m-3">
          <Col :xs="2" :sm="4" :md="6" :lg="4" :xl="3" :xxl="2">
            <a-button
              type="ghost"
              :disabled="currentEditKeyRef !== ''"
              @click="addItem"
              shape="circle"
              preIcon="ant-design:border-inner-outlined"
            />
          </Col>
        </Row>
      </template>
    </BasicTable>

    <Row type="flex" justify="center" class="m-3" :gutter="{ xs: 4, sm: 8, md: 12, lg: 16 }"
      ><Col :xs="8" :lg="4" :md="6">
        <a-button type="primary" @click="customResetFunc">上一步</a-button>
      </Col>
      <Col :xs="8" :lg="4" :md="6">
        <a-button type="primary" @click="customSubmitFunc">确认提交</a-button>
      </Col>
    </Row>
  </div>
</template>
<script lang="ts" setup>
  import {
    ActionItem,
    BasicColumn,
    BasicTable,
    EditRecordRow,
    useTable,
  } from '/@/components/Table';
  import { ref, toRefs, nextTick, computed } from 'vue';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { ImpExcel } from '/@/components/Excel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Row, Col, Alert } from 'ant-design-vue';
  import { encryptByMd5 } from '/@/utils/cipher';
  import { SubjectInfo } from './data';
  import { getGradeEnum, gradeMappings } from '/@/enums/gradeEnum';
  import { GenderEnum } from '/@/enums/genderEnum';
  import { addSubject } from '/@/api/subject';
  const currentEditKeyRef = ref('');
  const { createMessage: msg } = useMessage();
  function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: '编辑',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: handleEdit.bind(null, record),
        },
        {
          label: '删除',
          disabled: getDataSource().length === 1,
          onClick: handleDelete.bind(null, record),
        },
      ];
    }
    return [
      {
        label: '保存',
        onClick: handleSave.bind(null, record, column),
      },
      {
        label: '取消',
        popConfirm: {
          title: '是否取消编辑',
          confirm: handleCancel.bind(null, record, column),
        },
      },
    ];
  }
  const props = defineProps<{ subject: SubjectInfo }>();
  const { level, subName, subDesp, genders, grades } = toRefs(props.subject);

  const tableTitle = computed(() => {
    let title = grades.value.map((g) => gradeMappings[parseInt(g)]).join('，');

    const set = new Set(genders.value);

    if (set.has(GenderEnum.M)) {
      title += ' 男生';
    }
    if (set.has(GenderEnum.F)) {
      title += '女生';
    }
    title += subName.value;
    return title;
  });
  const levelOptions = level.value.map((item) => {
    return {
      label: item,
      value: item,
    };
  });
  const columns: BasicColumn[] = [
    {
      dataIndex: 'lower',
      title: '下限',
      editRow: true,
      editComponentProps: {
        min: 0,
      },
      editValueMap(value) {
        return value.toString();
      },
      editComponent: 'InputNumber',
      editRule: true,
    },
    {
      dataIndex: 'upper',
      title: '上限',
      editRow: true,
      editComponent: 'InputNumber',
      editComponentProps: {
        min: 0,
      },
      editValueMap(value) {
        return value.toString();
      },
    },
    {
      dataIndex: 'score',
      title: '分数',
      editComponent: 'InputNumber',
      editRule: true,
      editRow: true,
      editComponentProps: {
        min: 0,
      },
      editValueMap(value) {
        return value.toString();
      },
    },
    {
      dataIndex: 'level',
      title: '等级',
      editComponent: 'Select',
      editComponentProps: {
        options: levelOptions,
        placeholder: '请选择',
        showSearch: true,
      },
      editRow: true,
      editRule: true,
    },
  ];
  const emit = defineEmits(['next', 'prev']);
  const tableData = [
    {
      key: encryptByMd5(new Date().toString()),
      lower: 0,
      upper: 100,
      level: level.value[0],
      score: 60,
    },
  ];
  const [
    registerTable,
    { deleteTableDataRecord, getDataSource, setTableData, findTableDataRecord },
  ] = useTable({
    columns,
    dataSource: tableData,
    pagination: false,
    showTableSetting: true,
    inset: true,
    striped: true,
    bordered: true,
    canResize: false,
    rowKey: 'key',
    title: tableTitle,
    titleHelpMessage: subDesp,
    autoCreateKey: false,
    tableSetting: { size: false, redo: false, setting: false, fullScreen: true },
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleEdit(record: EditRecordRow) {
    currentEditKeyRef.value = record.key;
    record.onEdit?.(true);
  }

  function handleCancel(record: EditRecordRow) {
    currentEditKeyRef.value = '';
    record.onEdit?.(false, false);
  }

  function handleDelete(record: EditRecordRow) {
    deleteTableDataRecord(record.key);
  }

  async function handleSave(record: EditRecordRow) {
    // 校验
    msg.loading({ content: '正在保存...', duration: 0, key: 'saving' });
    const valid = await record.onValid?.();
    if (valid) {
      try {
        const pass = await record.onEdit?.(false, true);
        if (pass) {
          currentEditKeyRef.value = '';
        }
        msg.success({ content: '数据已保存', key: 'saving' });
        setTableData(getDataSource().sort((a, b) => a.lower - b.lower));
      } catch (error) {
        msg.error({ content: '保存失败', key: 'saving' });
      }
    } else {
      msg.error({ content: '请填写正确的数据', key: 'saving' });
    }
  }

  function addItem() {
    const data = getDataSource().sort((a, b) => a.lower - b.lower);
    const item = {
      key: encryptByMd5(new Date().toString()),
      lower: data[data.length - 1]['upper'],
      upper: undefined,
      level: undefined,
      score: undefined,
    };
    data.push(item);
    setTableData(data);
    nextTick(() => {
      const record: EditRecordRow = findTableDataRecord(item.key) as EditRecordRow;
      currentEditKeyRef.value = record.key;
      record.onEdit?.(true);
    });
  }

  async function customResetFunc() {
    emit('prev');
  }

  async function customSubmitFunc() {
    try {
      const scoreSheet = getDataSource().map((item) => item.editValueRefs);
      const newSubject = await addSubject({
        subName: subName.value,
        subDesp: subDesp?.value,
        grades: grades.value.map((g) => getGradeEnum(g)),
        genders: genders.value,
        scoreSheet,
      });
      if (newSubject) {
        emit('next', scoreSheet);
      }
    } catch (error) {}
  }
</script>

<style scoped lang="less">
  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 5px !important;
  }
</style>
