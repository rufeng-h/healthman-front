<template>
  <div
    ><PageWrapper content-full-height content-background dense title="科目信息">
      <template #headerContent>
        <a-form :model="query" layout="inline">
          <a-form-item
            label="科目名称"
            name="msName"
            :wrapperCol="{ span: 20, style: { width: '20rem' } }"
            :labelCol="{ span: 4 }"
            ><a-input-search
              v-model:value="query.subName"
              @search="doSearch"
              @change="onChange"
              placeholder="输入名称搜索"
          /></a-form-item>
        </a-form>
      </template>
      <template #extra>
        <a-button
          v-if="hasPermission(SUBJECT_INSERT)"
          type="primary"
          pre-icon="ant-design:plus-circle-outlined"
          @click="tryAddSubject"
          >创建新科目</a-button
        >
      </template>
      <a-list
        :data-source="dataSource"
        :pagination="pagination"
        :grid="{ gutter: 8, xs: 1, sm: 1, md: 3, lg: 4, xl: 4, xxl: 6 }"
        :loading="loading"
        ><template #renderItem="{ item }">
          <a-list-item>
            <a-card class="!rounded-lg relative" hoverable>
              <div class="font-semibold flex flex-row justify-between">
                <div><a-avatar src="/src/assets/images/logo.png" /> {{ item.subName }}</div>
                <div class="text-center flex align-middle"
                  ><a-tag
                    v-if="item.compName !== undefined"
                    color="orange"
                    style="font-size: 1.1em; font-weight: 500; margin: auto auto"
                    >{{ item.compName }}</a-tag
                  ></div
                >
              </div>
              <div class="my-2"
                ><a-tooltip :title="item.subDesp"
                  ><div class="truncate text-secondary">{{ item.subDesp }}</div></a-tooltip
                ></div
              >
              <div class="flex flex-row justify-between mb-2">
                <div v-if="item.msInfos === undefined || item.msInfos.length === 0">
                  <a-tag color="red" style="font-size: 1.1em">暂无体测信息</a-tag>
                </div>
                <div v-else v-for="msInfo in item.msInfos" :key="msInfo.name">
                  <a-popover>
                    <template #content>
                      <a-table
                        bordered
                        size="small"
                        row-key="grade"
                        :columns="msInfoColumns"
                        :dataSource="msInfo.value"
                        :pagination="false"
                      >
                        <template #male="{ record }">
                          <Icon v-if="record.M" icon="icon-park:correct" color="green" />
                          <Icon v-else icon="codicon:error" color="red" />
                        </template>
                        <template #female="{ record }">
                          <Icon v-if="record.F" icon="icon-park:correct" color="green" />
                          <Icon v-else icon="codicon:error" color="red" />
                        </template>
                      </a-table>
                    </template>
                    <a-tag color="green" style="font-size: 1.1em">{{ msInfo.name }}</a-tag>
                  </a-popover>
                </div>
              </div>
              <div class="flex flex-row justify-between">
                <div class="action">
                  <div class="action-item" v-if="item.hasScore">
                    <a-tooltip title="查看评分标准">
                      <Icon
                        icon="akar-icons:more-horizontal"
                        color="#33f834"
                        class="aciton-icon"
                        :size="20"
                        @click="handleView(item)" /></a-tooltip
                  ></div>
                  <div v-else class="action-item">
                    <a-tooltip title="无成绩标准">
                      <Icon
                        icon="ep:warning-filled"
                        color="orange"
                        class="aciton-icon"
                        :size="20" /></a-tooltip
                  ></div>

                  <div class="action-item" v-if="hasPermission(SUBJECT_UPDATE)">
                    <a-tooltip title="编辑科目信息">
                      <Icon
                        icon="bxs:edit"
                        color="#018ffb"
                        class="aciton-icon"
                        :size="20"
                        @click="handleEdit(item)"
                    /></a-tooltip>
                  </div>

                  <div class="action-item" v-if="hasPermission(SUBJECT_DELETE)">
                    <a-tooltip title="删除该科目">
                      <Icon
                        icon="ep:delete-filled"
                        color="#f00"
                        class="aciton-icon"
                        :size="20"
                        @click="handleDel(item)"
                    /></a-tooltip>
                  </div>
                  <div class="action-item" v-if="hasPermission(SCOS_UPLOAD)">
                    <a-tooltip title="导入评分标准">
                      <ImpExcel @success="handleImpScoreSheet($event, item)">
                        <Icon
                          icon="mdi:database-import"
                          :size="20"
                          color="#42d27d"
                          class="aciton-icon"
                        />
                      </ImpExcel>
                    </a-tooltip>
                  </div>
                </div>

                <div class="flex flex-col justify-center text-secondary">
                  {{ item.subCreated }}
                </div>
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
      <SubjectModal @register="subjectModal" @submit="doSubmit" />
      <ScoreSheetExcelModal @register="excelModal" @confirm="doUpload" />
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import ScoreSheetExcelModal from './ScoreSheetExcelModal.vue';
  import {
    List,
    PaginationProps,
    Card,
    Avatar,
    Form,
    Tag,
    Popover,
    Table,
    Tooltip,
  } from 'ant-design-vue';
  import {
    SubjectInfoModel,
    SubjectQuery,
    pageSubjectInfo,
    updateSubject,
    addSubject,
    deleteSubject,
    msInfoColumns,
  } from '/@/api/subject';
  import Icon from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  import { ImpExcel } from '/@/components/Excel';
  import { uploadScoreSheet } from '/@/api/scoreSheet';
  import { useMessage } from '/@/hooks/web/useMessage';
  import SubjectModal from './SubjectModal.vue';
  import { ROUTENAMES } from '/@/router/routes/routeMapping';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import {
    SUBJECT_INSERT,
    SUBJECT_UPDATE,
    SUBJECT_DELETE,
    SUBJECT_LIST,
    SCOS_PAGE,
    SCOS_UPLOAD,
  } from '/@/store/modules/Authority';
  export default defineComponent({
    components: {
      ImpExcel,
      ScoreSheetExcelModal,
      Icon,
      SubjectModal,
      [Tooltip.name]: Tooltip,
      [Table.name]: Table,
      [Popover.name]: Popover,
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Card.name]: Card,
      PageWrapper,
      [Tag.name]: Tag,
      [Avatar.name]: Avatar,
    },
    setup() {
      const { hasPermission } = usePermission();
      const go = useGo();
      const DEFAULT_PAGE_SIZE = 8;
      const { createMessage, createConfirm } = useMessage();
      onMounted(() => {
        fetchData();
      });
      const fetchData = async (params: SubjectQuery | undefined = undefined) => {
        if (params === undefined) {
          params = { page: state.pagination.current, pageSize: state.pagination.pageSize };
        }
        try {
          state.loading = true;
          const data = await pageSubjectInfo(params);
          state.pagination.total = data.total;
          state.pagination.current = data.current;
          state.pagination.pageSize = data.pageSize;
          state.dataSource = data.items;
        } finally {
          state.loading = false;
        }
      };
      const state = reactive<{
        dataSource: SubjectInfoModel[];
        pagination: PaginationProps;
        loading: boolean;
        query: SubjectQuery;
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
        loading: false,
        query: { subName: '' },
      });
      async function handleDel(sub: SubjectInfoModel) {
        createConfirm({
          iconType: 'warning',
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            const success = await deleteSubject(sub.subId);
            if (success) {
              createMessage.success({ content: '操作成功', key: 'delSubject' });
              fetchData();
            }
          },
          title: `此操作将会删除科目${sub.subName}及其所有评分标准，确认继续？`,
        });
      }
      function handleImpScoreSheet({ excelDataList, file }, sub: SubjectInfoModel) {
        openExcelModal(true, { excelDataList, file, subId: sub.subId });
      }
      async function doUpload(subId: number, file: File) {
        const data = await uploadScoreSheet(subId, file);
        createMessage.success(`导入${data}条数据`);
      }
      async function doSubmit({ isUpdate, sub }) {
        let success = false;
        if (isUpdate) {
          success = await updateSubject(sub);
        } else {
          success = await addSubject(sub);
        }
        if (success) {
          createMessage.success('操作成功!');
          fetchData();
        }
      }
      function handleView(sub: SubjectInfoModel) {
        go({
          //@ts-ignore
          name: ROUTENAMES.SUBJECT.SUBJECT_DETAIL,
          params: { subId: sub.subId },
        });
      }
      function handleEdit(sub: SubjectInfoModel) {
        openSubjectModal(true, { isUpdate: true, sub });
      }
      const doSearch = () => {
        const query = state.query;
        if (query.subName && query.subName !== '') {
          fetchData(state.query);
        }
      };
      const onChange = (e) => {
        const value = e.target.value;
        if (value === '') {
          fetchData();
        }
      };
      function tryAddSubject() {
        openSubjectModal(true, { isUpdate: false });
      }
      const [subjectModal, { openModal: openSubjectModal }] = useModal();
      const [excelModal, { openModal: openExcelModal }] = useModal();
      return {
        ...toRefs(state),
        tryAddSubject,
        doSearch,
        onChange,
        msInfoColumns,
        excelModal,
        subjectModal,
        doUpload,
        doSubmit,
        handleDel,
        handleEdit,
        handleImpScoreSheet,
        handleView,

        hasPermission,
        SUBJECT_INSERT,
        SUBJECT_UPDATE,
        SUBJECT_DELETE,
        SUBJECT_LIST,
        SCOS_PAGE,
        SCOS_UPLOAD,
      };
    },
  });
</script>
<style scoped lang="less">
  .action {
    margin-top: 0.4rem;
    &-item {
      display: inline-block;
      padding: 0 0.5rem;
      color: @text-color-secondary;
      border-right: 1px solid @border-color-base;
      &:nth-child(1) {
        padding-left: 0;
      }

      &:last-child {
        border-right: 0;
      }
    }

    &-icon {
      margin-right: 0.1rem;
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

  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 0.2rem !important;
  }
</style>
