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
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import { useRoute } from 'vue-router';
  import { DEFAULT_MS, getMeasurementDetail, MeasurementDetailModel } from '/@/api/measurement';
  import { PageWrapper } from '/@/components/Page';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { Descriptions, Progress, Tag } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container';
  import { BasicTitle } from '/@/components/Basic';

  export default defineComponent({
    components: {
      BasicTitle,
      CollapseContainer,
      [Progress.name]: Progress,
      [Tag.name]: Tag,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
      PageWrapper,
    },
    setup() {
      const { setTitle: setTabTitle } = useTabs();
      const route = useRoute();
      type StateType = {
        ms: MeasurementDetailModel;
      };
      const state = reactive<StateType>({
        ms: DEFAULT_MS,
      });
      onMounted(async () => {
        state.ms = await getMeasurementDetail(route.params.msId as unknown as number);
        setTabTitle(state.ms.msName);
      });

      return {
        ...toRefs(state),
      };
    },
  });
</script>
