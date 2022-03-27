<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-24 16:35:50
 * @LastEditTime: 2022-03-24 17:22:02
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <div>{{}}</div>
</template>

<script lang="ts" setup>
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute } from 'vue-router';
  import { onMounted } from 'vue';
  import { getClassDetail } from '/@/api/ptclass';
  const route = useRoute();
  const { setTitle } = useTabs();

  onMounted(async () => {
    const cls = await getClassDetail(route.params.clsCode as unknown as string);
    setTitle(cls.clsName);
  });
</script>
