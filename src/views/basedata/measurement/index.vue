<template>
  <div>
    <PageWrapper :class="prefixCls" title="测试记录" dense>
      <template #headerContent>
        <a-form :model="query" layout="inline">
          <a-form-item
            label="测试名称"
            name="msName"
            :wrapperCol="{ span: 20, style: { width: '20rem' } }"
            :labelCol="{ span: 4 }"
            ><a-input-search
              v-model:value="query.msName"
              @search="doSearch"
              @change="onChange"
              placeholder="输入名称搜索"
          /></a-form-item>
        </a-form>
      </template>
      <template #extra>
        <a-button type="primary" pre-icon="ant-design:plus-circle-outlined" @click="addMeasurement"
          >新建体测</a-button
        >
      </template>

      <a-list
        :loading="loading"
        :pagination="pagination"
        :data-source="dataSource"
        :grid="{ gutter: 8, xs: 1, sm: 1, md: 3, lg: 4, xl: 4, xxl: 6 }"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :class="`${prefixCls}__card`" hoverable>
              <div :class="`${prefixCls}__card-title`">
                <a-avatar src="/src/assets/images/logo.png" :class="`${prefixCls}__card-avatar`" />

                {{ item.msName }}
                <span :class="`${prefixCls}__card-title-creator`">{{
                  item.msCreatedAdminName
                }}</span>
              </div>

              <div :class="`${prefixCls}__card-detail`">
                <div :class="`${prefixCls}__card-detail-grp`"
                  ><a-tag color="orange" style="font-size: 1.1em">{{ item.grpName }}</a-tag>
                </div>
                <div :class="`${prefixCls}__card-detail-cnt`">
                  <a-row type="flex">
                    <a-col :span="8">
                      <span :class="`${prefixCls}__card-detail-cnt-title`">科目数 </span>
                      <span :class="`${prefixCls}__card-detail-cnt-value`">{{ item.subCnt }}</span>
                    </a-col>
                    <a-col :span="8">
                      <span :class="`${prefixCls}__card-detail-cnt-title`">学生数 </span>
                      <span :class="`${prefixCls}__card-detail-cnt-value`">{{
                        item.stuCnt ? item.stuCnt : 0
                      }}</span>
                    </a-col>
                    <a-col :span="8"
                      ><span :class="`${prefixCls}__card-detail-cnt-title`">已完成 </span>
                      <span :class="`${prefixCls}__card-detail-cnt-value`">{{
                        item.compStuCnt ? item.compStuCnt : 0
                      }}</span></a-col
                    >
                  </a-row>
                </div>
                <span :class="`${prefixCls}__card-detail-desp`">{{ item.msDesp }}</span>
              </div>
              <div :class="`${prefixCls}__card-action`">
                <div :class="`${prefixCls}__card-action-item`">
                  <a-tooltip title="查看成绩详情">
                    <Icon
                      icon="akar-icons:more-horizontal"
                      color="#33f834"
                      :class="`${prefixCls}__card-action-icon`"
                      :size="20"
                      @click="handleView(item)" /></a-tooltip
                ></div>

                <div :class="`${prefixCls}__card-action-item`">
                  <a-tooltip title="编辑体测信息">
                    <Icon
                      icon="bxs:edit"
                      color="#018ffb"
                      :class="`${prefixCls}__card-action-icon`"
                      :size="20"
                      @click="handleEdit(item)"
                    />
                  </a-tooltip>
                </div>
                <div :class="`${prefixCls}__card-action-item`">
                  <a-tooltip title="删除本次体测">
                    <Icon
                      icon="ep:delete-filled"
                      color="#f00"
                      :about="`${prefixCls}__card-action-icon`"
                      :size="20"
                      @click="handleDel(item)"
                    />
                  </a-tooltip>
                </div>
                <div :class="`${prefixCls}__card-action-item`">
                  <a-tooltip title="导入体测数据">
                    <ImpExcel @success="handleImpScore($event, item)">
                      <Icon
                        icon="mdi:database-import"
                        :size="20"
                        color="#42d27d"
                        :class="`${prefixCls}__card-action-icon`"
                      />
                    </ImpExcel>
                  </a-tooltip>
                </div>
                <div :class="`${prefixCls}__card-action-item`">
                  <a-tooltip title="下载成绩模板">
                    <Icon
                      icon="el:download"
                      :size="20"
                      color="#42d2dd"
                      :class="`${prefixCls}__card-action-icon`"
                      @click="downloadFileTemplate(item)"
                    />
                  </a-tooltip>
                </div>
              </div>
              <div :class="`${prefixCls}__card-progress`"
                ><a-progress
                  :percent="Math.floor((item.compStuCnt / item.stuCnt) * 100)"
                  :stroke-color="{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }"
              /></div>
              <span :class="`${prefixCls}__card-time`">
                {{ item.msCreated }}
              </span>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </PageWrapper>
    <MeasurementModal @register="measureModal" @success="addSuccess" />
    <ScoreExcelModal @confirm="doUpload" @register="excelModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon/index';
  import {
    Card,
    Row,
    Col,
    List,
    InputSearch,
    Form,
    Avatar,
    Progress,
    Tag,
    PaginationProps,
    Statistic,
    Tooltip,
  } from 'ant-design-vue';
  import {
    pageMeasurementInfo,
    MeasurementInfoModel,
    MeasurementQuery,
    delMeasurement,
    addMeasurement,
    updateMeasurement,
    downloadMsTemplate,
  } from '/@/api/measurement';
  import { useModal } from '/@/components/Modal';
  import MeasurementModal from './MesurementModal.vue';
  import ScoreExcelModal from './ScoreExcelModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uploadScore } from '/@/api/score';
  import { useGo } from '/@/hooks/web/usePage';
  import { useLoading } from '/@/components/Loading';
  import { ImpExcel } from '/@/components/Excel';

  export default defineComponent({
    components: {
      [Statistic.name]: Statistic,
      Icon,
      [Tooltip.name]: Tooltip,
      ImpExcel,
      MeasurementModal,
      [Tag.name]: Tag,
      [Progress.name]: Progress,
      [Avatar.name]: Avatar,
      PageWrapper,
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [Card.name]: Card,
      [Card.Meta.name]: Card.Meta,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Row.name]: Row,
      [Col.name]: Col,
      [InputSearch.name]: InputSearch,
      ScoreExcelModal,
    },
    setup() {
      const impExcel = ref();
      const go = useGo();
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '请稍后...',
      });
      const DEFAULT_PAGE_SIZE = 8;
      const { createConfirm, createMessage } = useMessage();
      onMounted(() => {
        fetchData({ pageSize: DEFAULT_PAGE_SIZE });
      });
      const fetchData = async (params: MeasurementQuery | undefined = undefined) => {
        if (params === undefined) {
          params = { page: state.pagination.current, pageSize: state.pagination.pageSize };
        }
        try {
          state.loading = true;
          const data = await pageMeasurementInfo(params);
          state.pagination.total = data.total;
          state.pagination.current = data.current;
          state.pagination.pageSize = data.pageSize;
          state.dataSource = data.items;
        } finally {
          state.loading = false;
        }
      };
      const doSearch = () => {
        const query = state.query;
        if (query.msName && query.msName !== '') {
          fetchData(state.query);
        }
      };
      const onChange = (e) => {
        const value = e.target.value;
        if (value === '') {
          fetchData();
        }
      };
      const state = reactive<{
        dataSource: MeasurementInfoModel[];
        pagination: PaginationProps;
        query: MeasurementQuery;
        loading: boolean;
      }>({
        dataSource: [],
        pagination: {
          current: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          total: 0,
          onChange(page, pageSize) {
            fetchData({ page, pageSize });
          },
        },
        query: { msName: '' },
        loading: false,
      });
      const [measureModal, { openModal: openMsModal }] = useModal();
      const [excelModal, { openModal: openExcelModal }] = useModal();
      function tryAddMeasurement() {
        openMsModal(true, { isUpdate: false });
      }
      function handleEdit(item) {
        openMsModal(true, { isUpdate: true, record: item });
      }
      async function handleDel(item: MeasurementInfoModel) {
        createConfirm({
          iconType: 'warning',
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            const data = await delMeasurement(item.msId);
            if (data) {
              fetchData();
            }
          },
          title: `删除测试${item.msName}?`,
        });
      }
      async function handleSubmit({ isUpdate, values }) {
        let success = false;
        if (isUpdate) {
          success = await updateMeasurement(values);
          createMessage.success('更新成功!');
        } else {
          success = await addMeasurement(values);
          createMessage.success('添加成功!');
        }
        if (success) {
          fetchData();
        }
      }
      function handleImpScore({ excelDataList, file }, ms: MeasurementInfoModel) {
        openExcelModal(true, { excelDataList, file, msId: ms.msId });
      }
      function handleView(measurement: MeasurementInfoModel) {
        go({
          // @ts-ignore
          name: 'BaseDataMeasurementDetail',
          params: {
            msId: measurement.msId,
          },
        });
      }
      async function downloadFileTemplate(measurement: MeasurementInfoModel) {
        try {
          openFullLoading();
          await downloadMsTemplate(measurement.msId);
        } finally {
          closeFullLoading();
        }
      }
      async function doUpload(msId: number, file: File) {
        console.log(msId, file);

        try {
          openFullLoading();
          const data = await uploadScore(file, msId);
          closeFullLoading();
          if (data) {
            createMessage.success(`成功添加${data}条数据`);
            fetchData();
          }
        } catch (e) {
          closeFullLoading();
          throw e;
        }
      }
      return {
        impExcel,
        excelModal,
        doUpload,
        handleImpScore,
        addSuccess: handleSubmit,
        measureModal,
        addMeasurement: tryAddMeasurement,
        prefixCls: 'list-card',
        ...toRefs(state),
        doSearch,
        onChange,

        handleView,
        handleEdit,
        handleDel,
        downloadFileTemplate,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-card {
    &__card {
      position: relative;
      border-radius: 10px;

      &-title {
        font-size: 1.1em;
        font-weight: 700;
        vertical-align: middle;
        color: @text-color;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
        margin-right: 4rem;

        &-creator {
          font-size: 0.9em;
          font-weight: lighter;
          color: @text-color-secondary;
          position: absolute;
          right: 1rem;
        }
      }
      &-detail {
        font-size: 1em;
        div {
          margin-top: 0.2rem;
          margin-bottom: 0.2rem;
        }
        &-grp {
          color: #444;
        }
        &-cnt {
          &-title {
            color: rgba(0, 0, 0, 0.45);
          }
          &-value {
            font-size: 1.2em;
            color: #000;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial,
              Noto Sans, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', Segoe UI Symbol,
              'Noto Color Emoji';
          }
        }
        &-desp {
          color: rgba(0, 0, 0, 0.7);
          font-size: 1em;
        }
      }
      &-action {
        margin-top: 0.4rem;
        &-item {
          display: inline-block;
          padding: 0 0.5rem;
          color: @text-color-secondary;

          &:nth-child(1) {
            padding-left: 0;
          }

          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4) {
            border-right: 1px solid @border-color-base;
          }
        }

        &-icon {
          margin-right: 0.1rem;
        }
      }

      &-progress {
        margin-right: 9rem;
        margin-bottom: -0.7rem;
        font-size: 0.8rem;
        height: 100%;
      }

      &-time {
        position: absolute;
        bottom: 0.2rem;
        right: 1rem;
        color: @text-color-secondary;
      }

      &-avatar {
        vertical-align: middle;
      }
    }
  }

  ::v-deep(.ant-list) {
    margin: 0.5rem;
  }

  ::v-deep(.ant-card-body) {
    padding: 1rem;
  }

  ::v-deep(.ant-list-item) {
    margin-bottom: 0.5rem !important;
  }
</style>
