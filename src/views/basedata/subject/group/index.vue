<template>
  <PageWrapper :class="prefixCls" title="科目组信息" content-full-height dense>
    <template #headerContent>
      <a-form :model="query">
        <a-form-item label="科目组名" :labelCol="{ span: 2 }" :wrapperCol="{ span: 6 }">
          <a-input-search
            allowClear
            v-model:value="query.grpName"
            placeholder="输入名称搜索"
            @change="onChange"
            @search="doSearch"
        /></a-form-item>
      </a-form>
    </template>
    <template #extra>
      <a-button type="primary" pre-icon="ant-design:plus-circle-outlined" @click="addGroup"
        >新增科目组</a-button
      ></template
    >

    <div :class="`${prefixCls}__container`">
      <a-list :pagination="pagination" size="small">
        <template v-for="item in dataSource" :key="item.grpId">
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                <div :class="`${prefixCls}__content`">
                  {{ item.grpDesp }}
                </div>
                <div :class="`${prefixCls}__action`">
                  <template v-for="action in actions" :key="action.icon">
                    <div :class="`${prefixCls}__action-item`">
                      <Icon
                        v-if="action.icon"
                        :class="`${prefixCls}__action-icon`"
                        :icon="action.icon"
                        :color="action.color"
                      />
                      {{ action.text }}
                    </div>
                  </template>
                  <span :class="`${prefixCls}__time`">{{ item.grpCreated }}</span>
                </div>
              </template>
              <template #title>
                <div :class="`${prefixCls}__title`">
                  {{ item.grpName }}
                  <span :class="`${prefixCls}__creator`"> {{ item.createdAdminName }}</span>
                </div>
                <div>
                  <template v-for="tag in item.subjects" :key="tag.subId">
                    <Tag class="mb-2" color="orange" style="fontsize: 1.1em">
                      {{ tag.subName }}
                    </Tag>
                  </template>
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { PaginationProps, Tag } from 'ant-design-vue';
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { List, InputSearch, Form } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { pageSubGroupInfo, SubGroupInfoModel, SubGroupQuery } from '/@/api/subgroup';

  export default defineComponent({
    components: {
      Icon,
      Tag,
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [InputSearch.name]: InputSearch,
      PageWrapper,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
    },
    setup() {
      const go = useGo();
      const DEFAULT_PAGE_SIZE = 3;
      onMounted(() => {
        fetchData({ pageSize: DEFAULT_PAGE_SIZE });
      });
      const fetchData = async (params) => {
        const data = await pageSubGroupInfo(params);
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
        dataSource: SubGroupInfoModel[];
        pagination: PaginationProps;
        query: SubGroupQuery;
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
        query: { grpName: '' },
      });
      const addGroup = () => {
        go({
          //@ts-ignore
          name: 'BaseDataSubjectGroupAdd',
        });
      };
      const actions = [
        { icon: 'clarity:star-line', text: '156', color: '#018ffb' },
        { icon: 'bx:bxs-like', text: '156', color: '#459ae8' },
        { icon: 'bx:bxs-message-dots', text: '2', color: '#42d27d' },
      ];
      return {
        prefixCls: 'list-search',
        ...toRefs(state),
        addGroup,
        actions,
        doSearch,
        onChange,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-search {
    &__header {
      &-form {
        margin-bottom: -16px;
      }
    }

    &__container {
      margin: 0.5rem;
      border-radius: 8px;
    }

    &__title {
      margin-bottom: 0.3rem;
      font-size: 1.2em;
    }

    &__creator {
      position: absolute;
      right: 1rem;
      color: rgb(0 0 0 / 45%);
      font-size: 0.8em;
    }

    &__content {
      color: @text-color-secondary;
    }

    &__action {
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

    &__time {
      position: absolute;
      right: 1rem;
      color: rgb(0 0 0 / 45%);
    }
  }

  ::v-deep(.ant-list-item) {
    margin: 0.3rem;
    background-color: @component-background;
    border-radius: 10px;
  }
</style>
