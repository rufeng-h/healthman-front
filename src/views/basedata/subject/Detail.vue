<template>
  <div>
    <PageWrapper content-full-height dense content-background>
      <template #headerContent>
        <div class="flex flex-row flex-wrap md:justify-end lg:justify-between lg:w-2/3 mx-auto">
          <Alert
            message="若无指定年级和性别的评分标准则认为该项科目无需测试。评分区间为左开右闭，若无上限或下限可不填"
            show-icon
          />
        </div>
      </template>
      <div class="lg:w-2/3 mx-auto">
        <BasicTable @register="tableRef">
          <template #action="{ record, column }">
            <TableAction :actions="createActions(record, column)" />
          </template>
          <template #gender="{ record }">
            <Icon v-if="record.gender === 'M'" icon="twemoji:male-sign" />
            <Icon v-else icon="twemoji:female-sign" />
          </template>
          <template #toolbar>
            <a-button type="primary" @click="tryAddLevel" :disabled="currentEditKey !== ''"
              >新增等级</a-button
            >
          </template>
        </BasicTable>
      </div>
      <LevelModal @register="levelModal" @submit="addLevel" />
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
    pageScoreSheet,
    ScoreSheetModel,
    SCORE_SHEET_MAX,
    SCORE_SHEET_MIN,
    ScoreSheetQuery,
    updateScoreSheet,
    deleteScoreSheet,
  } from '/@/api/scoreSheet';
  import { getGradeEnum, gradeOptions, numberGradeToZhcn } from '/@/enums/gradeEnum';
  import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
  import { FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import LevelModal from './LevelModal.vue';
  import { useModal } from '/@/components/Modal';
  import { EMPTY_SUB, getSubjectDetail, SubjectDetailModel } from '/@/api/subject';
  import { useRoute } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import Icon from '/@/components/Icon';
  export default defineComponent({
    components: {
      PageWrapper,
      Alert,
      TableAction,
      BasicTable,
      LevelModal,
      Icon,
    },
    setup() {
      const { createMessage: msg } = useMessage();
      const { setTitle: setTabTitle } = useTabs();
      const route = useRoute();
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
              disabled: state.currentEditKey !== '',
              popConfirm: {
                title: '确认删除吗',
                confirm: handleDelete.bind(null, record, column),
              },
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
        sub: SubjectDetailModel;
        tableTitle: string;
      } = reactive({
        helpMessage: '',
        currentEditKey: '',
        sub: EMPTY_SUB,
        tableTitle: '',
      });
      onMounted(async () => {
        state.sub = await getSubjectDetail(route.params.subId as unknown as number);
        setTabTitle(state.sub.subName);
        state.helpMessage = state.sub.subDesp;
      });
      const { helpMessage, tableTitle } = toRefs(state);
      const formScheme: FormSchema[] = [
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
        },
      ];
      watch(
        () => state.currentEditKey,
        () => {
          if (state.currentEditKey !== '') {
            setShowPagination(false);
            setTableProps({ tableSetting: { redo: false, fullScreen: true } });
            getForm().setProps({
              resetButtonOptions: {
                disabled: true,
              },
              submitButtonOptions: {
                disabled: true,
              },
            });
          } else {
            setShowPagination(true);
            setTableProps({ tableSetting: { redo: true, fullScreen: true } });
            getForm().setProps({
              resetButtonOptions: {
                disabled: false,
              },
              submitButtonOptions: {
                disabled: false,
              },
            });
          }
        },
      );
      const [
        tableRef,
        {
          getDataSource,
          reload,
          getColumns,
          setColumns,
          getForm,
          setShowPagination,
          setProps: setTableProps,
        },
      ] = useTable({
        afterFetch(data: ScoreSheetModel[]) {
          const columns = getColumns();
          data.forEach((s) => {
            if (s.upper !== undefined && s.upper >= SCORE_SHEET_MAX) {
              s.upper = undefined;
            }
            if (s.lower !== undefined && s.lower <= SCORE_SHEET_MIN) {
              s.lower = undefined;
            }
          });
          columns.forEach((c) => {
            if (c.dataIndex === 'level' && c.editComponentProps !== undefined) {
              c.editComponentProps.options = state.sub.levels.map((l) => {
                return { label: l, value: l };
              });
            }
          });
          setColumns(columns);
          /* 更新表格标题 */
          let title = '';
          const params = getForm().getFieldsValue();
          if (state.sub.subName) {
            title += state.sub.subName;
          }
          if (params.grade) {
            title += ' ' + numberGradeToZhcn(params.grade);
          }
          if (params.gender) {
            title += params.gender === 'M' ? ' 男' : ' 女';
          }
          state.tableTitle = title;
          return data;
        },
        beforeFetch(params: ScoreSheetQuery) {
          params.subId = parseInt(route.params.subId as string);
          return params;
        },
        columns: scoreSheetColumns,
        api: pageScoreSheet,
        striped: true,
        showTableSetting: true,
        autoCreateKey: true,
        showIndexColumn: true,
        tableSetting: { fullScreen: true },
        title: tableTitle,
        size: 'small',
        inset: true,
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
      });
      function handleEdit(record: EditRecordRow) {
        state.currentEditKey = record.key;
        record.onEdit?.(true);
      }
      function handleCancel(record: EditRecordRow) {
        state.currentEditKey = '';
        record.onEdit?.(false, false);
      }
      async function handleDelete(record: EditRecordRow & ScoreSheetModel) {
        const key = 'deleteScoreSheet';
        msg.loading({ content: '正在执行...', key });
        try {
          const success = await deleteScoreSheet(record.id);
          if (success) {
            msg.success({ content: '操作成功!', key });
            reload();
            state.currentEditKey = '';
          } else {
            msg.error({ content: '操作失败', key });
          }
        } catch (e) {
          msg.error({ content: '操作失败', key });
        }
      }
      async function handleSave(record: EditRecordRow & ScoreSheetModel) {
        // 校验
        msg.loading({ content: '正在保存...', duration: 3, key: 'saving' });
        const valid = await record.onValid?.();
        if (valid) {
          try {
            const data = {
              id: record.id,
              subId: record.subId,
              gender: record.gender,
              grade: getGradeEnum(record.grade),
              upper: record.editValueRefs?.upper,
              lower: record.editValueRefs?.lower,
              level: record.editValueRefs?.level,
              score: record.editValueRefs?.score,
            };
            const success = await updateScoreSheet(data);
            if (success) {
              msg.success({ content: '数据已保存', key: 'saving' });
              const pass = await record.onEdit?.(false, true);
              if (pass) {
                state.currentEditKey = '';
              }
            } else {
              msg.error({ content: '保存失败', key: 'saving' });
            }
          } catch (error) {
            msg.error({ content: '保存失败', key: 'saving' });
          }
        } else {
          msg.error({ content: '请填写正确的数据', key: 'saving' });
        }
      }
      const [levelModal, { openModal: openLevelModal }] = useModal();
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

      return {
        tableRef,
        createActions,
        tryAddLevel,
        getDataSource,
        addLevel,
        levelModal,
        ...toRefs(state),
      };
    },
  });
</script>
