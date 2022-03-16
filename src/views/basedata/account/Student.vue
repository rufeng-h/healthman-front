<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-14 10:37:19
 * @LastEditTime: 2022-03-16 16:02:52
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <CollegeTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable
      bordered
      :title="tableTile"
      @register="tableRef"
      :columns="studentColumns"
      class="w-3/4 xl:w-4/5"
      :api="getStudentPage"
      :before-fetch="beforeFetch"
      show-table-setting
      :immediate="true"
      :table-setting="{ fullScreen: true }"
    >
      <template #gender="{ record }">
        <Icon v-if="record.gender === 'M'" icon="twemoji:male-sign" />
        <Icon v-else icon="twemoji:female-sign" />
      </template>

      <template #avatar="{ record }">
        <Image :src="record.avatar" :height="30" :width="30" />
      </template>

      <template #number="{ record }">
        <Tag color="green">{{ record.number }}</Tag>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { Icon } from '/@/components/Icon';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import CollegeTree from './CollegeTree.vue';
  import { Image, Tag } from 'ant-design-vue';
  import { studentColumns, getStudentPage, StudentQuery } from '/@/api/student';
  import { ref } from 'vue';
  import OrderEnum from '/@/enums/OrderEnum';
  import { isArray } from '/@/utils/is';
  let selectedCode = '';
  const tableTile = ref('未选择班级');
  const [tableRef, { reload }] = useTable();
  const beforeFetch = (params: StudentQuery) => {
    if (selectedCode) {
      params.classCode = selectedCode;
    }
    const { field, order } = params;
    if (field || order) {
      throw new Error('请求参数异常' + field + ' ' + order);
    }
    if (field && order) {
      if (order === 'descend') {
        params.order = OrderEnum.DESC;
      } else if (order === 'ascend') {
        params.order = OrderEnum.ASC;
      } else {
        throw new Error('order参数异常 => ' + order);
      }
    }
    if (params.gender && isArray(params.gender)) {
      params.gender = params.gender[0];
    }
    return params;
  };
  const handleSelect = (keys: string[], event) => {
    const record = event.selectedNodes[0].props.node;
    if (!record.isLeaf) return;
    selectedCode = keys[0];
    tableTile.value = record.collegeName + ' ' + record.title;
    reload({ page: 1 });
  };
</script>

<style lang="less" scoped>
  ::v-deep(td .ant-image .ant-image-img) {
    max-width: 30px;
    max-height: 30px;
  }
</style>
