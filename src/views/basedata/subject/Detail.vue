<template>
  <div>
    <PageWrapper content-full-height dense content-background>
      <template #headerContent>
        <div class="flex flex-row flex-wrap md:justify-end lg:justify-between lg:w-2/3 mx-auto">
          <Alert
            message="若无指定年级和性别的评分标准则认为该项科目无需测试。评分区间为左开右闭，若无上限或下限可不填"
            show-icon
          />
          <div>
            <a-button
              pre-icon="ant-design:plus-circle-outlined"
              type="primary"
              @click="addSubject"
              class="mt-1"
              >添加新科目</a-button
            >
          </div>
        </div>
      </template>
      <div class="lg:w-2/3 mx-auto">
        <BasicTable @register="tableRef">
          <template #action="{ record, column }">
            <TableAction :actions="createActions(record, column)" />
          </template>
          <template #toolbar>
            <a-button type="primary" @click="tryAddLevel" :disabled="getDataSource().length === 0"
              >新增等级</a-button
            >
            <a-button type="primary" @click="tryModifySub" :disabled="getDataSource().length === 0"
              >修改科目基本信息</a-button
            >
          </template>
        </BasicTable>
      </div>
      <LevelModal @register="levelModal" @submit="addLevel" />
      <SubjectModal @register="subjectModal" />
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { Alert } from 'ant-design-vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    EditRecordRow,
    BasicColumn,
    ActionItem,
  } from '/@/components/Table';
  import {
    scoreSheetColumns,
    getScoreSheetList,
    ScoreSheetModel,
    SCORE_SHEET_MAX,
    SCORE_SHEET_MIN,
  } from '/@/api/scoreSheet';
  import { gradeOptions } from '/@/enums/gradeEnum';
  import { getSubjectList } from '/@/api/subject';
  import { defineComponent, reactive, toRefs } from 'vue';
  import { FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import LevelModal from './LevelModal.vue';
  import { useModal } from '/@/components/Modal';
  import SubjectModal from './step/SubjectModal.vue';
  export default defineComponent({
    components: {
      SubjectModal,
      PageWrapper,
      Alert,
      TableAction,
      BasicTable,
      LevelModal,
    },
    setup() {
      const { createMessage: msg } = useMessage();
      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '编辑',
              disabled: state.currentEditKey ? state.currentEditKey !== record.key : false,
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
      const state: {
        currentEditKey: string;
        helpMessage: string;
      } = reactive({
        helpMessage: '',
        currentEditKey: '',
      });
      const { helpMessage } = toRefs(state);
      const formScheme: FormSchema[] = [
        {
          field: 'subjectId',
          label: '科目',
          component: 'ApiSelect',
          colProps: {
            span: 8,
          },
          componentProps: {
            api: getSubjectList,
            immediate: true,
            labelField: 'subName',
            valueField: 'subId',
            showSearch: true,
            onSelect(_, opt) {
              console.log(opt);
              if (opt.subDesp) {
                helpMessage.value = opt.subDesp;
              }
            },
          },
          required: true,
        },
        {
          field: 'grade',
          label: '年级',
          component: 'Select',
          colProps: {
            span: 8,
          },
          componentProps: {
            options: gradeOptions,
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
            options: [
              { label: '男', value: 'M' },
              { label: '女', value: 'F' },
            ],
          },
          required: true,
        },
      ];
      const [tableRef, { getDataSource, deleteTableDataRecord, getColumns, setColumns }] = useTable(
        {
          afterFetch(data: ScoreSheetModel[]) {
            const levels = new Set();
            const columns = getColumns();
            data.forEach((s) => {
              if (!levels.has(s.level)) {
                levels.add(s.level);
              }
              if (s.upper !== undefined && s.upper >= SCORE_SHEET_MAX) {
                s.upper = undefined;
              }
              if (s.lower !== undefined && s.lower <= SCORE_SHEET_MIN) {
                s.lower = undefined;
              }
            });
            columns.forEach((c) => {
              if (c.dataIndex === 'level' && c.editComponentProps !== undefined) {
                c.editComponentProps.options = Array.from(levels).map((l) => {
                  return { label: l, value: l };
                });
              }
            });
            setColumns(columns);
            return data;
          },
          columns: scoreSheetColumns,
          api: getScoreSheetList,
          rowKey: 'id',
          striped: true,
          pagination: false,
          immediate: false,
          showTableSetting: true,
          showIndexColumn: true,
          tableSetting: { fullScreen: true, setting: false, redo: false },
          title: '男生评分标准',
          titleHelpMessage: helpMessage,
          useSearchForm: true,
          formConfig: {
            submitOnReset: false,
            labelWidth: 100,
            showAdvancedButton: true,
            compact: true,
            schemas: formScheme,
          },
          bordered: true,
        },
      );
      function handleEdit(record: EditRecordRow) {
        state.currentEditKey = record.key;
        record.onEdit?.(true);
      }
      function handleCancel(record: EditRecordRow) {
        state.currentEditKey = '';
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
              state.currentEditKey = '';
            }
            msg.success({ content: '数据已保存', key: 'saving' });
            /**
             * TODO
             */
          } catch (error) {
            msg.error({ content: '保存失败', key: 'saving' });
          }
        } else {
          msg.error({ content: '请填写正确的数据', key: 'saving' });
        }
      }
      const [levelModal, { openModal: openLevelModal }] = useModal();
      const [subjectModal, { openModal: openSubjectModal }] = useModal();
      function tryAddLevel() {
        const columns = getColumns();
        let ls = [];
        columns.forEach((l) => {
          if (l.dataIndex === 'level') {
            if (l.editComponentProps !== undefined) {
              ls = l.editComponentProps.options.map((o) => o.label);
            }
          }
        });
        openLevelModal(true, ls);
      }
      function addSubject() {
        openSubjectModal(true);
      }
      function addLevel(level: string) {
        const columns = getColumns();
        columns.forEach((l) => {
          if (l.dataIndex === 'level') {
            if (l.editComponentProps !== undefined) {
              l.editComponentProps.options.push({ label: level, value: level });
            }
          }
        });
        setColumns(columns);
      }
      function tryModifySub() {
        openSubjectModal(true);
      }
      return {
        tryModifySub,
        addSubject,
        tableRef,
        createActions,
        tryAddLevel,
        getDataSource,
        addLevel,
        subjectModal,
        levelModal,
      };
    },
  });
</script>
