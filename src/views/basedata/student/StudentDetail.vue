<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-24 18:17:57
 * @LastEditTime: 2022-03-24 18:34:00
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <div
    ><PageWrapper dense content-full-height>
      <div class="p-2">
        <CollapseContainer trigger-window-resize bordered>
          <template #title>
            <BasicTitle helpMessage="点击右侧箭头可折叠面板" :normal="false" span
              >学生详细信息</BasicTitle
            ></template
          >
          <div class="flex flex-row justify-between flex-wrap">
            <div class="flex flex-row ml-2 p-1">
              <a-avatar :src="stu.avatar" :size="65" />
              <div class="flex flex-col justify-center ml-1">
                <div class="text-lg p-1"
                  >{{ stu.stuId }}&nbsp;{{ stu.stuName
                  }}<Icon
                    icon="fontisto:famale"
                    v-if="stu.stuGender === 'F'"
                    color="pink"
                    class="ml-1" />
                  <Icon
                    icon="fontisto:male"
                    v-else-if="stu.stuGender === 'M'"
                    color="#3344ee"
                    class="ml-1"
                /></div>
                <div class="text-secondary p-1">
                  <a-tag color="green">{{ stu.clgName }}</a-tag>
                  <a-tag color="orange">{{ stu.clsName }}</a-tag>
                </div>
              </div>
            </div>

            <div class="flex flex-row justify-center ml-2">
              <div class="flex flex-col justify-center text-right mr-6 md: mt-2">
                <span class="text-secondary"> 体测数 </span>
                <span class="text-xl">{{ stu.msStatus.length }}</span>
              </div>
              <div class="flex flex-col justify-center text-right mr-6 md: mt-2">
                <span class="text-secondary"> 进行中 </span>
                <span class="text-xl">{{
                  stu.msStatus.reduce((prev, ms) => (!ms.status ? prev + 1 : prev + 0), 0)
                }}</span>
              </div>

              <div class="flex flex-col justify-center text-right md: mt-2">
                <span class="text-secondary"> 已完成 </span>
                <span class="text-xl">{{
                  stu.msStatus.reduce((prev, ms) => (ms.status ? prev + 1 : prev + 0), 0)
                }}</span>
              </div>
            </div>
            <div class="flex flex-col justify-center mx-4 p-2 text-dark-500">
              <div class="p-1">{{ stu.stuDesp }}</div>
              <div class="p-1 text-gray-500" v-if="stu.stuLastLogin"
                >上次登录：{{ stu.stuLastLogin }}</div
              >
            </div>
          </div>
        </CollapseContainer>
      </div>
      <div class="m-1">
        <a-list
          :pagination="pagination"
          :data-source="dataSource"
          size="small"
          itemLayout="vertical"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <div class="relative">
                <div class="flex flex-row justify-start">
                  <div class="mr-2">
                    <a-avatar src="/src/assets/images/logo.png" :size="{ xl: 40 }" />
                  </div>
                  <div class="flex flex-col justify-center text-base font-medium hover:text-lg">
                    {{ item.msName }}
                    <span class="absolute top-0 right-0 text-secondary text-sm">
                      {{ item.msCreatedAdminName }}</span
                    >
                  </div>
                </div>
                <div class="mt-1">
                  <a-tooltip v-for="sub in item.subjects" :key="sub.subId" :title="sub.subDesp">
                    <a-tag :color="sub.status ? 'green' : 'red'" class="mb-2 hover:text-base">{{
                      sub.subName
                    }}</a-tag>
                  </a-tooltip>
                </div>
                <div class="mt-1 text-sm">
                  {{ item.msDesp }}
                </div>
                <!-- <div :class="`${prefixCls}__action`">
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
              </div> -->
                <div class="absolute right-0 bottom-0 text-secondary">{{ item.msCreated }}</div>
              </div>

              <CollapseContainer
                :default-expand="false"
                :can-expan="item.scores != undefined && item.scores.length !== 0"
              >
                <template #title>
                  <BasicTitle
                    :helpMessage="item.scores ? '点击右侧箭头查看数据详情' : '未测试或成绩未上传'"
                    :normal="false"
                    span
                    >{{ item.scores ? '成绩详细信息' : '暂无成绩信息' }}
                  </BasicTitle></template
                >
                <a-tabs defaultActiveKey="table" animated>
                  <a-tab-pane key="table" tab="成绩">
                    <BasicTable
                      :can-resize="false"
                      :data-source="item.scores"
                      :columns="scoreColumns"
                      row-key="scoId"
                      inset
                      :pagination="false"
                  /></a-tab-pane>
                  <a-tab-pane key="radar" tab="图表">
                    <div
                      class="xl:flex flex-row justify-around 2xl:flex flex-row justify-around lg:flex flex-row justify-around"
                    >
                      <SaleRadar
                        v-if="item.scores !== undefined && item.scores.length >= 3"
                        class="2xl:w-2/5 xl:w-2/5 lg:w-2/5 md:w-full sm:w-full"
                        height="20rem"
                        :stu-ms="item"
                      />
                      <Line
                        class="2xl:w-2/5 xl:w-2/5 lg:w-2/5 md:w-full sm:w-full"
                        height="20rem"
                      />
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </CollapseContainer>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { useRoute } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import { getStudentInfo, DEFAULT_STU, StuMeasurementInfoModel } from '/@/api/student';
  import { Avatar, List, PaginationProps, Tabs, Tag, Tooltip } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTitle } from '/@/components/Basic';
  import Icon from '/@/components/Icon';
  import { pageStuMeasurementDetail, StuMeasurementDetailModel } from '/@/api/measurement';
  import { BasicPageParams } from '/@/api/model/baseModel';
  import { scoreColumns } from '/@/api/score';
  import { BasicTable } from '/@/components/Table';
  import { CollapseContainer } from '/@/components/Container';
  import SaleRadar from './SaleRadar.vue';
  import Line from './Line.vue';

  export default defineComponent({
    components: {
      SaleRadar,
      Line,
      [Tooltip.name]: Tooltip,
      [Tabs.name]: Tabs,
      [Tabs.TabPane.name]: Tabs.TabPane,
      CollapseContainer,
      Icon,
      BasicTable,
      [Tag.name]: Tag,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [List.Item.Meta.name]: List.Item.Meta,
      BasicTitle,
      [Avatar.name]: Avatar,
      PageWrapper,
    },
    setup() {
      const route = useRoute();
      const { setTitle } = useTabs();
      type StateType = {
        stu: StuMeasurementInfoModel;
        dataSource: StuMeasurementDetailModel[];
        pagination: PaginationProps;
      };
      const state = reactive<StateType>({
        stu: DEFAULT_STU,
        dataSource: [],
        pagination: {
          onChange(page, pageSize) {
            fetchMsData(state.stu.stuId, { page, pageSize });
          },
        },
      });
      async function fetchMsData(stuId: string, params: BasicPageParams = {}) {
        const data = await pageStuMeasurementDetail(stuId, params);
        state.pagination.total = data.total;
        state.pagination.current = data.current;
        state.pagination.pageSize = data.pageSize;
        state.dataSource = data.items;
        state.dataSource.forEach((s) =>
          s.scores.sort((s1, s2) => {
            if (s1.subId !== s2.subId) {
              return s1.subId - s2.subId;
            }
            if (s1.score !== undefined && s2.score !== undefined) {
              return s2.score - s1.score;
            }
            return 0;
          }),
        );
      }
      onMounted(async () => {
        state.stu = await getStudentInfo(route.params.stuId as string);
        setTitle(state.stu.stuId + ' ' + state.stu.stuName);
        fetchMsData(state.stu.stuId, { page: 1 });
      });
      const actions = [
        { icon: 'clarity:star-line', text: '156', color: '#018ffb' },
        { icon: 'bx:bxs-like', text: '156', color: '#459ae8' },
        { icon: 'bx:bxs-message-dots', text: '2', color: '#42d27d' },
      ];
      return {
        ...toRefs(state),
        scoreColumns,
        prefixCls: 'list-ms',
        actions,
      };
    },
  });
</script>
<style scoped lang="less">
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

  ::v-deep(.ant-list-item) {
    margin: 0.3rem;
    background-color: @component-background;
    border-radius: 10px;
    position: relative;
  }

  ::v-deep(.ant-list-item-meta) {
    margin-bottom: 0;
  }
  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 0.3rem !important;
  }
</style>
