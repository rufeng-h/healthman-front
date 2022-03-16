<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:35:53
 * @LastEditTime: 2022-03-12 17:26:23
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <PageWrapper contentBackground contentClass="flex" dense contentFullHeight>
    <BasicTable
      @register="registerTable"
      title="学院信息"
      titleHelpMessage="温馨提醒"
      :striped="striped"
      :bordered="border"
      :pagination="{ pageSize: 10 }"
      :after-fetch="afterFetch"
      show-table-setting
      can-resize
      :table-setting="{ redo: true, size: false, setting: true }"
    >
      <template #id="{ record }">
        <Tag color="green">
          {{ record.id }}
        </Tag>
      </template>
      <template #home="{ record }">
        <a-button type="primary" @click="openWindow(record.home)">主页</a-button>
      </template>
      <template #toolbar>
        <!-- <a-button type="primary" @click="handlePage">
          {{ pagination ? '分页显示' : '不分页' }}
        </a-button> -->
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { BasicTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { collegeColumns, CollegeModel, getCollegeList } from '/@/api/college';
  import { useTable } from '/@/components/Table';
  import { ref } from 'vue';
  import { openWindow } from '/@/utils';
  const striped = ref(true);
  const border = ref(true);
  const afterFetch = (data) => {
    data.forEach((college: CollegeModel) => {
      college.id = college.id.toString().padStart(3, '0');
    });
    return data;
  };
  // const handlePage = () => {
  //   pagination.value = !pagination.value;
  // };
  const [registerTable, _] = useTable({
    title: '学院信息',
    api: getCollegeList,
    columns: collegeColumns,
  });
</script>
