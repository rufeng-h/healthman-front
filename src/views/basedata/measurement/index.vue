<template>
  <div>
    <PageWrapper :class="prefixCls" title="测试记录">
      <template #headerContent>
        <a-form :model="query" layout="inline">
          <a-form-item
            label="测试名称"
            name="msName"
            :wrapperCol="{ span: 20, style: { width: '20rem' } }"
            :labelCol="{ span: 4 }"
            ><a-input-search @search="doSearch" @change="onChange" placeholder="输入名称搜索"
          /></a-form-item>
        </a-form>
      </template>
      <template #extra>
        <a-button type="primary" pre-icon="ant-design:plus-circle-outlined" @click="addMeasurement"
          >新建测试</a-button
        >
      </template>

      <div :class="`${prefixCls}__content`">
        <a-list :pagination="pagination" :data-source="dataSource">
          <a-row :gutter="16">
            <template v-for="item in dataSource" :key="item.title">
              <a-col :xs="24" :sm="16" :md="12" :lg="8" :xl="6" :xxl="8">
                <a-list-item>
                  <a-card :class="`${prefixCls}__card`" hoverable>
                    <div :class="`${prefixCls}__card-title`">
                      <a-avatar
                        src="/src/assets/images/logo.png"
                        :class="`${prefixCls}__card-avatar`"
                      />

                      {{ item.msName }}
                      <span :class="`${prefixCls}__card-creator`">{{
                        item.msCreatedAdminName
                      }}</span>
                    </div>

                    <div :class="`${prefixCls}__card-detail`">
                      <div :class="`${prefixCls}__card-grp`"
                        >科目组：<a-tag color="orange" style="font-size: 1.1em">{{
                          item.grpName
                        }}</a-tag>
                        <span>{{ item.subCnt }}个科目 {{ item.stuCnt }}人参加</span></div
                      >
                      <div :class="`${prefixCls}__card-cnt`">
                        <a-tag color="green" v-for="cls in item.classes" :key="cls.clsCode">
                          {{ cls.clsName }}
                        </a-tag>
                      </div>
                      <span :class="`${prefixCls}__card-desp`">{{ item.msDesp }}</span>
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
              </a-col>
            </template>
          </a-row>
        </a-list>
      </div>
    </PageWrapper>
    <ImpExcel @success="loadSuccess" ref="impExcel" />
    <MeasurementModal @register="measureModal" @success="addSuccess" />
    <ExcelModal @confirm="doUpload" @cancel="cancelUpload" @register="excelModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, toRefs, unref } from 'vue';
  import { cardList } from './data';
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
  } from 'ant-design-vue';
  import {
    pageMeasurementInfo,
    MeasurementInfoModel,
    MeasurementQuery,
    delMeasurement,
  } from '/@/api/measurement';
  import { useModal } from '/@/components/Modal';
  import MeasurementModal from './MesurementModal.vue';
  import ExcelModal from '../ExcelModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uploadScore } from '/@/api/score';

  export default defineComponent({
    components: {
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
      let curMsItem: Nullable<MeasurementInfoModel> = null;
      const DEFAULT_PAGE_SIZE = 3;
      const { createConfirm, createMessage } = useMessage();
      onMounted(() => {
        fetchData({ pageSize: DEFAULT_PAGE_SIZE });
      });
      const fetchData = async (params = {}) => {
        const data = await pageMeasurementInfo(params);
        state.pagination.total = data.total;
        state.pagination.current = data.current;
        state.pagination.pageSize = data.pageSize;
        state.dataSource = data.items;
      };
      const doSearch = () => {
        fetchData(state.query);
      };
      const onChange = (e) => {
        const value = e.target.value;
        if (value === '') {
          fetchData({});
        }
      };
      const state = reactive<{
        dataSource: MeasurementInfoModel[];
        pagination: PaginationProps;
        query: MeasurementQuery;
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
      });
      const actions: any[] = [
        { icon: 'bxs:edit', color: '#018ffb', action: handleEdit, size: 20 },
        { icon: 'ep:delete-filled', color: '#f00', action: handleDel, size: 20 },
        { icon: 'mdi:database-import', color: '#42d27d', action: handleImpScore, size: 20 },
      ];
      const [measureModal, { openModal: openMsModal }] = useModal();
      const [excelModal, { openModal: openExcelModal }] = useModal();
      function addMeasurement() {
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
      function addSuccess() {
        createMessage.success('添加成功!');
        fetchData();
      }
      function handleImpScore(measurement: MeasurementInfoModel) {
        curMsItem = measurement;
        unref(impExcel).handleUpload();
      }
      function loadSuccess(excelDataList, file) {
        openExcelModal(true, { excelDataList, file });
      }

      async function doUpload(file) {
        const data = await uploadScore(file, curMsItem?.msId);
        if (data) {
          createMessage.success(`成功添加${data}条数据`);
          fetchData();
          curMsItem = null;
        }
      }
      function cancelUpload() {
        curMsItem = null;
      }
      return {
        impExcel,
        excelModal,
        doUpload,
        cancelUpload,
        loadSuccess,
        handleImpScore,
        addSuccess,
        measureModal,
        addMeasurement,
        prefixCls: 'list-card',
        list: cardList,
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
    &__link {
      margin-top: 10px;
      font-size: 14px;

      a {
        margin-right: 30px;
      }

      span {
        margin-left: 5px;
      }
    }

    &__card {
      margin-top: -0.3rem;
      width: 100%;
      border-radius: 10px;

      &-action {
        margin-top: 0.3rem;

        &-item {
          display: inline-block;
          padding: 0 0.3rem;
          color: @text-color-secondary;

          &:nth-child(1) {
            padding-left: 0;
          }

          &:nth-child(1),
          &:nth-child(2) {
            border-right: 1px solid @border-color-base;
          }
        }

        &-icon {
          margin-right: 0.1rem;
        }
      }

      &-creator {
        font-size: 0.9em;
        color: @text-color-secondary;
        position: absolute;
        right: 1rem;
      }

      &-progress {
        font-size: 0.8rem;
        margin-bottom: -0.8rem;
        margin-right: 8rem;
      }

      &-time {
        position: absolute;
        bottom: 0.1rem;
        right: 0.6rem;
        color: @text-color-secondary;
      }

      &-avatar {
        vertical-align: middle;
      }
      &-title {
        font-size: 1.2em;
        vertical-align: middle;
        color: @text-color;
      }

      &-detail {
        font-size: 1em;
        div {
          margin-top: 0.2rem;
          margin-bottom: 0.2rem;
        }
      }
      &-grp {
        color: #444;
      }

      &-desp {
        color: #ccc;
        font-size: 1em;
      }
    }
  }

  ::v-deep(.ant-card-body) {
    padding: 1rem;
  }

  ::v-deep(.ant-list-items) {
    padding: 0.5rem;
  }
</style>
