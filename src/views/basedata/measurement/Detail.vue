<template>
  <div>
    <PageWrapper dense content-full-height>
      <CollapseContainer trigger-window-resize bordered>
        <template #title>
          <BasicTitle helpMessage="点击右侧箭头可折叠面板" :normal="false" span
            >体测详细信息</BasicTitle
          ></template
        >
        <a-descriptions
          bordered
          size="small"
          :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
        >
          <a-descriptions-item label="体测编号">{{ ms.msId }}</a-descriptions-item>
          <a-descriptions-item label="体测名称">{{ ms.msName }}</a-descriptions-item>
          <a-descriptions-item label="备注信息">{{ ms.msDesp }}</a-descriptions-item>
          <a-descriptions-item label="创建人">{{ ms.msCreatedAdminName }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ ms.msCreated }}</a-descriptions-item>
          <a-descriptions-item label="上次修改">{{ ms.msModified }}</a-descriptions-item>
          <a-descriptions-item label="参与人数">{{ ms.stuCnt }}</a-descriptions-item>
          <a-descriptions-item label="已完成人数">{{ ms.compStuCnt }}</a-descriptions-item>
          <a-descriptions-item label="完成情况">
            <a-progress
              :percent="Math.floor((ms.compStuCnt / ms.stuCnt) * 100)"
              :stroke-color="{
                '0%': '#108ee9',
                '100%': '#87d068',
              }"
            />
          </a-descriptions-item>
          <a-descriptions-item label="科目组">{{ ms.grpName }}</a-descriptions-item>
          <a-descriptions-item label="科目" :span="2">
            <a-tag v-for="sub in ms.subjects" color="orange" :key="sub.subId">
              {{ sub.subName }}
            </a-tag>
          </a-descriptions-item>

          <a-descriptions-item label="班级">
            <a-tag v-for="cls in ms.classes" color="green" :key="cls.clsCode">
              {{ cls.clsName }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </CollapseContainer>
      <BasicTable @register="registerTable">
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
        <template #stuGender="{ record }">
          <Icon v-if="record.stuGender === 'M'" icon="twemoji:male-sign" />
          <Icon v-else icon="twemoji:female-sign" />
        </template>
        <template #toolbar>
          <a-button type="primary" @click="showMoreScoreData">{{
            showScoData ? '只显示成绩' : '显示体测数据和成绩'
          }}</a-button>
          <a-button type="primary" @click="downloadData">导出数据</a-button>
        </template>
        <template #expandedRowRender="{ record }">
          <a-table :columns="scoreColumns" :data-source="record.scores" :pagination="false" />
        </template>
      </BasicTable>
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
  import { useRoute } from 'vue-router';
  import { DEFAULT_MS, getMeasurementDetail, MeasurementDetailModel } from '/@/api/measurement';
  import { PageWrapper } from '/@/components/Page';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { Descriptions, Progress, Table, Tag } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container';
  import { BasicTitle } from '/@/components/Basic';
  import { useTable, BasicTable, BasicColumn, TableAction } from '/@/components/Table';
  import { pageMsScore, ScoreQuery, StuScoreInfo, scoreColumns, downloadScore } from '/@/api/score';
  import Icon from '/@/components/Icon';
  import { useLoading } from '/@/components/Loading';
  import { useGo } from '/@/hooks/web/usePage';
  export default defineComponent({
    components: {
      Icon,
      TableAction,
      [Table.name]: Table,
      BasicTable,
      [Table.name]: Table,
      BasicTitle,
      CollapseContainer,
      [Progress.name]: Progress,
      [Tag.name]: Tag,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
      PageWrapper,
    },
    setup() {
      const go = useGo();
      const { setTitle: setTabTitle } = useTabs();
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '正在导出...',
      });
      const route = useRoute();
      type StateType = {
        ms: MeasurementDetailModel;
        showScoData: boolean;
      };
      const tbCols = ref<BasicColumn[]>([]);
      const state = reactive<StateType>({
        showScoData: true,
        ms: DEFAULT_MS,
      });
      onMounted(async () => {
        state.ms = await getMeasurementDetail(route.params.msId as unknown as number);
        setTabTitle(state.ms.msName);
        reload({ page: 1 });
      });
      //@ts-ignore
      const [registerTable, { reload, setTableData, getDataSource, getForm }] = useTable({
        afterFetch(items: StuScoreInfo[]) {
          const cols: BasicColumn[] = [
            {
              title: '学号',
              dataIndex: 'stuId',
            },
            {
              title: '姓名',
              dataIndex: 'stuName',
            },
            {
              title: '性别',
              dataIndex: 'stuGender',
              slots: { customRender: 'stuGender' },
            },
            {
              title: '操作',
              dataIndex: '操作',
              slots: { customRender: 'action' },
              fixed: 'right',
              width: 50,
            },
          ];
          const subNames = new Set();
          items.forEach((info) => {
            info.scores.sort((s1, s2) => {
              if (s1.subId !== s2.subId) {
                return s1.subId - s2.subId;
              }
              if (s1.score !== undefined && s2.score != undefined) {
                return s2.score - s1.score;
              }
              return s2.scoData - s1.scoData;
            });
            info.scores.forEach((score) => {
              if (!subNames.has(score.subName)) {
                /* 新的列 */
                cols.push({
                  title: score.subName,
                  dataIndex: score.subName,
                });
                subNames.add(score.subName);
              }
              if (state.showScoData) {
                info[score.subName] = score.scoData;
                if (score.score) {
                  info[score.subName] += '/' + score.score;
                }
              } else {
                info[score.subName] = score.score;
              }
            });
          });
          tbCols.value = cols;
          return items;
        },
        showIndexColumn: false,
        api: pageMsScore,
        formConfig: {
          submitOnReset: false,
          labelWidth: 80,
          showAdvancedButton: true,
          compact: true,
          schemas: [
            {
              field: 'stuId',
              label: '学号',
              component: 'Input',
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
          ],
        },
        canResize: false,
        useSearchForm: true,
        //@ts-ignore
        columns: tbCols,
        bordered: true,
        immediate: false,
        beforeFetch(params: ScoreQuery) {
          params.msId = state.ms.msId;
          return params;
        },
        inset: true,
        rowKey: 'stuId',
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        title: '体测结果',
        titleHelpMessage: '默认展示最优成绩',
      });
      const showMoreScoreData = () => {
        state.showScoData = !state.showScoData;
        const items = getDataSource();
        items.forEach((info) => {
          // info.scores.sort((s1, s2) => {
          //   if (s1.subId !== s2.subId) {
          //     return s1.subId - s2.subId;
          //   }
          //   if (s1.score !== undefined && s2.score != undefined) {
          //     return s2.score - s1.score;
          //   }
          //   return s2.scoData - s1.scoData;
          // });
          info.scores.forEach((score) => {
            if (state.showScoData) {
              info[score.subName] = score.scoData;
              if (score.score) {
                info[score.subName] += '/' + score.score;
              }
            } else {
              info[score.subName] = score.score;
            }
          });
        });
        setTableData(items);
      };
      const downloadData = async () => {
        try {
          const form = getForm();
          openFullLoading();
          await downloadScore({ msId: state.ms.msId, ...form.getFieldsValue() });
        } finally {
          closeFullLoading();
        }
      };
      const handleView = (record) => {
        go({
          // @ts-ignore
          name: 'BaseDataStudentDetail',
          params: {
            stuId: record.stuId,
          },
        });
      };
      return {
        handleView,
        downloadData,
        showMoreScoreData,
        registerTable,
        ...toRefs(state),
        scoreColumns,
      };
    },
  });
</script>

<style scoped lang="less">
  .vben-basic-table-form-container {
    padding: 0.5rem 0 0 0;
    margin: 0;
  }
  ::v-deep(.vben-basic-form) {
    margin: 0 !important;
  }

  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 0.5rem !important;
  }
</style>
