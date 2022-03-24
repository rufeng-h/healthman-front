<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-22 18:20:54
 * @LastEditTime: 2022-03-22 19:40:02
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    width="50%"
    centered
    title="确认文件内容"
    okText="确认上传"
    cancelText="取消上传"
    @ok="confirmUpload"
  >
    <BasicTable
      v-for="(table, index) in tableListRef"
      :key="index"
      :title="table.title"
      :columns="table.columns"
      :dataSource="table.dataSource"
      :showIndexColumn="false"
    />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import { useModalInner } from '/@/components/Modal';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { BasicModal } from '/@/components/Modal';

  export default defineComponent({
    name: 'ExcelModal',
    components: { BasicTable, BasicModal },
    emits: ['confirm'],
    setup(_, { emit }) {
      const tableListRef = ref<
        {
          title: string;
          columns?: any[];
          dataSource?: any[];
        }[]
      >([]);
      let curFile = undefined;
      const [registerModal, { closeModal }] = useModalInner(({ excelDataList, file }) => {
        curFile = file;
        tableListRef.value = [];
        for (const excelData of excelDataList) {
          const {
            header,
            results,
            meta: { sheetName },
          } = excelData;
          const columns: BasicColumn[] = [];
          for (const title of header) {
            columns.push({ title, dataIndex: title });
          }
          tableListRef.value.push({ title: sheetName, dataSource: results, columns });
        }
      });
      const confirmUpload = () => {
        emit('confirm', curFile);
        closeModal();
      };
      return {
        registerModal,
        tableListRef,
        confirmUpload,
      };
    },
  });
</script>
