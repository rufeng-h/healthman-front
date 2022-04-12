<template>
  <a-table
    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    :dataSource="subStus"
    :pagination="false"
    :columns="columns"
    size="small"
    rowKey="grade"
  >
    <template #male="{ record }">
      <Icon @click="handleMClick(record)" v-if="record.M" icon="icon-park:correct" color="green" />
      <Icon @click="handleMClick(record)" v-else icon="codicon:error" color="red" />
    </template>
    <template #female="{ record }">
      <Icon @click="handleFClick(record)" v-if="record.F" icon="icon-park:correct" color="green" />
      <Icon @click="handleFClick(record)" v-else icon="codicon:error" color="red" />
    </template>
  </a-table>
</template>
<script lang="ts">
  import { Table, Tabs } from 'ant-design-vue';
  import { defineComponent, reactive, toRefs, watchEffect } from 'vue';
  import { SubStuSelectItem } from './prop';
  import Icon from '/@/components/Icon';

  export default defineComponent({
    components: {
      Icon,
      [Table.name]: Table,
      [Tabs.name]: Tabs,
      [Tabs.TabPane.name]: Tabs.TabPane,
    },
    props: {
      subStudents: {
        type: Array as PropType<SubStuSelectItem[]>,
        required: true,
      },
    },
    emits: ['update:SubStudents'],
    setup(props, { emit }) {
      const state: {
        selectedRowKeys: string[];
        subStus: SubStuSelectItem[];
        prevSelectedRows: SubStuSelectItem[];
      } = reactive({
        selectedRowKeys: [],
        subStus: props.subStudents,
        prevSelectedRows: [],
      });
      watchEffect(() => {
        state.subStus = props.subStudents;
        const selectedKeys: string[] = [];
        const prev: SubStuSelectItem[] = [];
        state.subStus.forEach((s) => {
          if (s.M && s.F) {
            selectedKeys.push(s.grade);
            prev.push(s);
          }
        });
        state.selectedRowKeys = selectedKeys;
        state.prevSelectedRows = prev;
      });

      const onSelectChange = (curSelectedKeys, rows: SubStuSelectItem[]) => {
        rows.forEach((r) => {
          /* 从不选变为选 */
          if (state.selectedRowKeys.indexOf(r.grade) === -1) {
            r.M = r.F = true;
          }
        });
        state.selectedRowKeys.forEach((g) => {
          if (curSelectedKeys.indexOf(g) === -1) {
            state.prevSelectedRows.forEach((row) => {
              if (row.grade === g) {
                row.F = row.M = false;
                return;
              }
            });
          }
        });
        state.selectedRowKeys = curSelectedKeys;
        state.prevSelectedRows = rows;
        emit('update:SubStudents', state.subStus);
      };
      const columns = [
        {
          title: '年级',
          dataIndex: 'grade',
        },
        {
          title: '男',
          dataIndex: 'M',
          slots: { customRender: 'male' },
        },
        {
          title: '女',
          dataIndex: 'F',
          slots: { customRender: 'female' },
        },
      ];
      function handleMClick(record) {
        record.M = !record.M;
        const checked = record.M && record.F;
        if (checked && state.selectedRowKeys.indexOf(record.grade) === -1) {
          state.selectedRowKeys.push(record.grade);
        } else {
          const index = state.selectedRowKeys.indexOf(record.grade);
          if (index !== -1) {
            state.selectedRowKeys.splice(index, 1);
          }
        }
        emit('update:SubStudents', state.subStus);
      }
      function handleFClick(record) {
        record.F = !record.F;
        const checked = record.M && record.F;
        if (checked && state.selectedRowKeys.indexOf(record.grade) === -1) {
          state.selectedRowKeys.push(record.grade);
        } else {
          const index = state.selectedRowKeys.indexOf(record.grade);
          if (index !== -1) {
            state.selectedRowKeys.splice(index, 1);
          }
        }
        emit('update:SubStudents', state.subStus);
      }
      return {
        handleMClick,
        handleFClick,
        columns,
        onSelectChange,
        ...toRefs(state),
      };
    },
  });
</script>
