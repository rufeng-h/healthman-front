<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-24 18:17:57
 * @LastEditTime: 2022-03-24 18:34:00
 * @Version: 1.0
 * @Description: TODO
-->
<template> <div></div></template>
<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { onMounted } from 'vue';
  import { getStudentDetail } from '/@/api/student';
  const route = useRoute();
  const { setTitle } = useTabs();
  onMounted(async () => {
    const stu = await getStudentDetail(route.params.stuId as string);
    setTitle(stu.stuId + ' ' + stu.stuName);
  });
</script>
