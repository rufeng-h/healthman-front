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
        :grid="{ gutter: 8, xs: 1, sm: 2, md: 4, lg: 6, xl: 4, xxl: 8 }"
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
                      <span :class="`${prefixCls}__card-detail-cnt-title`">科目数：</span>
                      <span :class="`${prefixCls}__card-detail-cnt-value`">{{ item.subCnt }}</span>
                    </a-col>
                    <a-col :span="8">
                      <span :class="`${prefixCls}__card-detail-cnt-title`">学生数：</span>
                      <span :class="`${prefixCls}__card-detail-cnt-value`">{{ item.stuCnt }}</span>
                    </a-col>
                    <a-col :span="8"
                      ><span :class="`${prefixCls}__card-detail-cnt-title`">已完成：</span>
                      <span :class="`${prefixCls}__card-detail-cnt-value`">{{
                        item.compStuCnt ? item.compStuCnt : 0
                      }}</span></a-col
                    >
                  </a-row>
                </div>
                <span :class="`${prefixCls}__card-detail-desp`">{{ item.msDesp }}</span>
              </div>
              <div :class="`${prefixCls}__card-action`">
                <template v-for="action in actions" :key="action.icon">
                  <div :class="`${prefixCls}__card-action-item`">
                    <Icon
                      v-if="action.icon"
                      :class="`${prefixCls}__card-action-icon`"
                      :icon="action.icon"
                      :color="action.color"
                      :size="action.size"
                      @click="action.action(item)"
                    />
                  </div>
                </template>
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
    <ImpExcel @success="loadSuccess" ref="impExcel" />
    <MeasurementModal @register="measureModal" @success="addSuccess" />
    <ExcelModal @confirm="doUpload" @register="excelModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, toRefs, unref } from 'vue';
  import { ImpExcel } from '/@/components/Excel';
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
  } from 'ant-design-vue';
  import {
    pageMeasurementInfo,
    MeasurementInfoModel,
    MeasurementQuery,
    delMeasurement,
    addMeasurement,
    updateMeasurement,
  } from '/@/api/measurement';
  import { useModal } from '/@/components/Modal';
  import MeasurementModal from './MesurementModal.vue';
  import ExcelModal from '../ExcelModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uploadScore } from '/@/api/score';
  import { useGo } from '/@/hooks/web/usePage';
  import { useLoading } from '/@/components/Loading';

  export default defineComponent({
    components: {
      [Statistic.name]: Statistic,
      Icon,
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
      ExcelModal,
    },
    setup() {
      const impExcel = ref();
      const go = useGo();
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '正在导入...',
      });
      let curMsItem: Nullable<MeasurementInfoModel> = null;
      const DEFAULT_PAGE_SIZE = 8;
      const { createConfirm, createMessage } = useMessage();
      onMounted(() => {
        fetchData({ pageSize: DEFAULT_PAGE_SIZE });
      });
      const fetchData = async (params = {}) => {
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
      const actions: any[] = [
        { icon: 'akar-icons:more-horizontal', color: '#33f834', action: handleView, size: 20 },
        { icon: 'bxs:edit', color: '#018ffb', action: handleEdit, size: 20 },
        { icon: 'ep:delete-filled', color: '#f00', action: handleDel, size: 20 },
        { icon: 'mdi:database-import', color: '#42d27d', action: handleImpScore, size: 20 },
      ];
      const [measureModal, { openModal: openMsModal }] = useModal();
      const [excelModal, { openModal: openExcelModal }] = useModal();
      function tryAddMeasurement() {
        openMsModal(true, { isUpdate: false });
      }
      function handleEdit(item) {
        openMsModal(true, { isUpdate: true, record: item });
      }
      async function handleDel(item: MeasurementInfoModel) {
        console.log(item);
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
        console.log(values);
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
      function handleImpScore(measurement: MeasurementInfoModel) {
        curMsItem = measurement;
        unref(impExcel).handleUpload();
      }
      function loadSuccess(excelDataList, file) {
        openExcelModal(true, { excelDataList, file });
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
      async function doUpload(file) {
        try {
          openFullLoading();
          const data = await uploadScore(file, curMsItem?.msId);
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
        loadSuccess,
        handleImpScore,
        addSuccess: handleSubmit,
        measureModal,
        addMeasurement: tryAddMeasurement,
        prefixCls: 'list-card',
        ...toRefs(state),
        doSearch,
        actions,
        onChange,
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
        font-size: 1.2em;
        vertical-align: middle;
        color: @text-color;

        &-creator {
          font-size: 0.9em;
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
          &:nth-child(3) {
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
</style>
