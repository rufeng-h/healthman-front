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
        <a-button type="primary" pre-icon="ant-design:plus-circle-outlined" @click="tryAddSubject"
          >新建体测</a-button
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
                <div v-for="msInfo in item.msInfos" :key="msInfo.name">
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
                          <Icon v-if="record.M" icon="icon-park:correct" color="green" />
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
                  <div v-for="action in actions" :key="action.icon" class="action-item">
                    <Icon
                      v-if="action.icon"
                      :icon="action.icon"
                      :color="action.color"
                      :size="action.size"
                      @click="action.action(item)"
                      class="aciton-icon"
                    />
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
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
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
  import { SubjectInfoModel, SubjectQuery, pageSubjectInfo } from '/@/api/subject';
  import Icon from '/@/components/Icon';
  export default defineComponent({
    components: {
      Icon,
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
      const msInfoColumns = [
        {
          title: '年级',
          dataIndex: 'grade',
        },
        {
          title: '男',
          dataIndex: 'M',
          slots: { customRender: 'male' },
        },
        {
          title: '女',
          dataIndex: 'F',
          slots: { customRender: 'female' },
        },
      ];
      const DEFAULT_PAGE_SIZE = 8;
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
      const actions: any[] = [
        { icon: 'akar-icons:more-horizontal', color: '#33f834', action: handleView, size: 20 },
        { icon: 'bxs:edit', color: '#018ffb', action: handleEdit, size: 20 },
        { icon: 'ep:delete-filled', color: '#f00', action: handleDel, size: 20 },
      ];
      async function handleDel() {}
      function handleView() {}
      function handleEdit() {}
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
      function tryAddSubject() {}
      return {
        ...toRefs(state),
        tryAddSubject,
        doSearch,
        onChange,
        actions,
        msInfoColumns,
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
