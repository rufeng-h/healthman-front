<template>
  <div class="md:flex">
    <template v-for="(item, index) in growCardList" :key="item.title">
      <Card
        size="small"
        :loading="loading"
        class="md:w-1/4 w-full !md:mt-0 !mt-4"
        :class="[index + 1 < 4 && '!md:mr-4']"
        :canExpan="false"
      >
        <!-- <template #extra>
          <Tag :color="item.color">{{ item.action }}</Tag>
        </template> -->

        <div class="flex justify-around">
          <Icon :icon="item.icon" :size="70" color="orange" />
          <div>
            <div class="my-1">{{ item.title }}</div>
            <CountTo :startVal="1" :endVal="item.value" class="text-2xl" />
          </div>
        </div>

        <!-- <div class="p-2 px-4 flex justify-between">
          <span>总{{ item.title }}</span>
          <CountTo :startVal="1" :endVal="item.total" />
        </div> -->
      </Card>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { CountTo } from '/@/components/CountTo/index';
  import { Icon } from '/@/components/Icon';
  import { Card } from 'ant-design-vue';
  import { growCardList } from '../data';

  defineProps({
    loading: {
      type: Boolean,
    },
  });
</script>
<style lang="less" scoped></style>
