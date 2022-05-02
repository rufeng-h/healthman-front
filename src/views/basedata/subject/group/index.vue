<template>
  <div>
    <PageWrapper :class="prefixCls" title="科目组信息" content-full-height dense>
      <template #headerContent>
        <a-form :model="query" layout="inline">
          <a-form-item label="科目组名" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
            <a-input-search
              allowClear
              v-model:value="query.grpName"
              placeholder="输入名称搜索"
              @change="onChange"
              @search="doSearch"
          /></a-form-item>
          <a-form-item label="只看我创建的" :labelCol="{ span: 18 }" :wrapperCol="{ span: 6 }">
            <a-checkbox v-model:checked="query.self" @change="doSearch"
          /></a-form-item>
        </a-form>
      </template>
      <template #extra>
        <a-button
          v-if="hasPermission(SUBGRP_INSERT)"
          type="primary"
          pre-icon="ant-design:plus-circle-outlined"
          @click="addGroup"
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
                  <div class="flex flex-row justify-between">
                    <div :class="`${prefixCls}__action`">
                      <div :class="`${prefixCls}__action-item`">
                        <Icon
                          :class="`${prefixCls}__action-icon`"
                          icon="akar-icons:more-horizontal"
                          :size="20"
                          color="#33f834"
                        />
                      </div>
                      <div :class="`${prefixCls}__action-item`" v-if="!item.shared">
                        <Icon
                          :class="`${prefixCls}__action-icon`"
                          icon="bxs:edit"
                          :size="20"
                          color="#018ffb"
                        />
                      </div>
                      <div :class="`${prefixCls}__action-item`" v-if="!item.shared">
                        <Icon
                          :class="`${prefixCls}__action-icon`"
                          icon="ep:delete-filled"
                          :size="20"
                          color="#f00"
                          @click="handleDel(item)"
                        />
                      </div>
                      <div :class="`${prefixCls}__action-item`" v-if="!item.shared">
                        <Icon
                          :class="`${prefixCls}__action-icon`"
                          icon="codicon:live-share"
                          :size="20"
                          color="#42ff33"
                          @click="tryShare(item)"
                        />
                      </div>
                    </div>
                    <div class="flex flex-col justify-center" :class="`${prefixCls}__time`"
                      ><span>{{ item.grpCreated }}</span></div
                    >
                  </div>
                </template>
                <template #title>
                  <div :class="`${prefixCls}__title`">
                    {{ item.grpName }}
                    <span :class="`${prefixCls}__creator`">
                      {{
                        item.shared
                          ? `由${item.grpCreatedTeaName}于${item.shareTime}分享`
                          : item.grpCreatedTeaName
                      }}</span
                    >
                  </div>
                  <div v-if="hasPermission(SUBGRP_SUBDELETE) && !item.shared">
                    <template v-for="tag in item.subjects" :key="tag.subId">
                      <Tag class="mb-2" color="orange">
                        {{ tag.subName }}
                        <template #icon>
                          <Icon
                            icon="clarity:remove-line"
                            @click="removeSub(item.grpId, tag.subId)"
                          />
                        </template>
                      </Tag>
                    </template>
                  </div>
                  <div v-else>
                    <template v-for="tag in item.subjects" :key="tag.subId">
                      <Tag class="mb-2" color="orange">
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
    <ShareModal @register="shareModal" @submit="handleShare" />
  </div>
</template>
<script lang="ts">
  import { PaginationProps, Tag, Checkbox } from 'ant-design-vue';
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { List, InputSearch, Form } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import {
    delSubGrp,
    pageSubGroupInfo,
    SubGroupInfoModel,
    SubGroupQuery,
    delSubFromGrp,
    SubGroupShareFormdata,
    shareSubGrp,
  } from '/@/api/subgroup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ROUTENAMES } from '/@/router/routes/routeMapping';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { SUBGRP_INSERT, SUBGRP_SUBDELETE } from '/@/store/modules/Authority';
  import { useLoading } from '/@/components/Loading';
  import ShareModal from './ShareModal.vue';
  import { useModal } from '/@/components/Modal';

  export default defineComponent({
    components: {
      ShareModal,
      Icon,
      Tag,
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [InputSearch.name]: InputSearch,
      PageWrapper,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
      [Checkbox.name]: Checkbox,
    },
    setup() {
      const go = useGo();
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '请稍后...',
      });
      const { hasPermission } = usePermission();
      const { createConfirm, createMessage } = useMessage();
      const DEFAULT_PAGE_SIZE = 3;
      onMounted(() => {
        fetchData(state.query);
      });
      const fetchData = async (params: SubGroupQuery | undefined = undefined) => {
        if (params === undefined) {
          params = { page: state.pagination.current, pageSize: state.pagination.pageSize };
        }
        try {
          state.loading = true;
          const data = await pageSubGroupInfo(params);
          state.pagination.total = data.total;
          state.pagination.current = data.current;
          state.pagination.pageSize = data.pageSize;
          state.dataSource = data.items;
        } finally {
          state.loading = false;
        }
      };
      const doSearch = (change) => {
        if (!!state.query.grpName || change !== undefined) {
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
        dataSource: SubGroupInfoModel[];
        pagination: PaginationProps;
        query: SubGroupQuery;
        loading: boolean;
      }>({
        dataSource: [],
        loading: false,
        pagination: {
          current: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          total: 0,
          onChange(page, pageSize) {
            fetchData({ page, pageSize });
          },
        },
        query: { grpName: '', self: false },
      });
      const addGroup = () => {
        go({
          //@ts-ignore
          name: ROUTENAMES.SUBJECT.SUBGRP_ADD,
        });
      };
      const actions: any[] = [
        { icon: 'codicon:live-share', color: '#42d27d', action: tryShare, size: 20 },
      ];
      const [shareModal, { openModal: openShareModal }] = useModal();
      async function tryShare(record: SubGroupInfoModel) {
        openShareModal(true, record);
      }
      async function handleShare(data: SubGroupShareFormdata) {
        try {
          openFullLoading();
          if (await shareSubGrp(data)) {
            createMessage.success('操作成功！');
            await fetchData();
          }
        } finally {
          closeFullLoading();
        }
      }
      async function handleDel(item: SubGroupInfoModel) {
        createConfirm({
          iconType: 'warning',
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            try {
              openFullLoading();
              const data = await delSubGrp(item.grpId);
              if (data) {
                await fetchData();
              }
            } finally {
              closeFullLoading();
            }
          },
          title: `删除科目组${item.grpName}?`,
        });
      }

      async function removeSub(grpId: number, subId: number) {
        try {
          openFullLoading();
          const success = await delSubFromGrp(grpId, subId);
          if (success) {
            let idx = -1;
            for (const grp of state.dataSource) {
              if (grpId === grp.grpId) {
                for (let i = 0; i < grp.subjects.length; i++) {
                  if (grp.subjects[i].subId === subId) {
                    idx = i;
                    break;
                  }
                }
                if (idx !== -1) {
                  grp.subjects.splice(idx, 1);
                  break;
                }
              }
            }
            if (idx !== -1) {
              createMessage.success('操作成功');
            }
          }
        } finally {
          closeFullLoading();
        }
      }

      return {
        prefixCls: 'list-search',
        handleShare,
        tryShare,
        shareModal,
        handleDel,
        ...toRefs(state),
        addGroup,
        actions,
        doSearch,
        onChange,
        removeSub,
        hasPermission,
        SUBGRP_INSERT,
        SUBGRP_SUBDELETE,
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
      margin-top: 0.4rem;
      &-item {
        display: inline-block;
        border-right: 1px solid @border-color-base;
        padding: 0 0.5rem;
        color: @text-color-secondary;

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

    &__time {
      color: rgb(0 0 0 / 45%);
    }
  }

  ::v-deep(.ant-list-item) {
    margin: 0.3rem;
    background-color: @component-background;
    border-radius: 10px;
  }
</style>
