<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-24 13:12:52
 * @LastEditTime: 2022-03-24 13:28:42
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <div>{{}}</div>
</template>
<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { onMounted } from 'vue';
  import { CollegeModel, getCollegeInfo } from '/@/api/college';
  import { useTabs } from '/@/hooks/web/useTabs';
  const route = useRoute();
  const { setTitle } = useTabs();
  onMounted(async () => {
    const college: CollegeModel = await getCollegeInfo(route.params.clgCode as unknown as string);
    setTitle(college.clgName);
  });
</script>
