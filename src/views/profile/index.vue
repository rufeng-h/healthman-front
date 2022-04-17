<template>
  <PageWrapper content-background>
    <Tabs>
      <template v-for="item in settingList" :key="item.key">
        <TabPane :tab="item.name">
          <component :is="item.component" />
        </TabPane>
      </template>
    </Tabs>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tabs } from 'ant-design-vue';

  import { settingList } from './data';

  import BaseSetting from './BaseSetting.vue';
  import SecureSetting from './SecureSetting.vue';
  import AccountBind from './AccountBind.vue';
  import MsgNotify from './MsgNotify.vue';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: {
      PageWrapper,
      Tabs,
      TabPane: Tabs.TabPane,
      BaseSetting,
      SecureSetting,
      AccountBind,
      MsgNotify,
    },
    setup() {
      return {
        settingList,
      };
    },
  });
</script>
<style lang="less">
  .ant-tabs-tab-active {
    background-color: @item-active-bg;
  }
</style>
