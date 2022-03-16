<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-13 10:49:11
 * @LastEditTime: 2022-03-13 12:08:01
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <Select :options="data.options" />
</template>

<script lang="ts" setup>
  import { Select } from 'ant-design-vue';
  import { reactive } from 'vue';
  const data = reactive({
    options: [
      {
        label: '你好',
        value: '1',
        disabled: false,
      },
    ],
  });

  setTimeout(() => (data.options = []), 4000);
  setTimeout(
    () => (data.options = [{ label: '哈哈哈', value: '恩恩呵呵', disabled: false }]),
    6000,
  );
</script>
