<template>
  <div class="bg-white overflow-hidden">
    <BasicTree
      :tree-data="treeData"
      :load-data="onLoadData"
      toolbar
      search
      title="班级列表"
      @select="handleSelect"
    />
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import { getCollegeTree } from '/@/api/college';
  import { TreeItem } from '/@/components/Tree';
  import { getClassTree } from '/@/api/ptclass';
  import { BasicTree } from '/@/components/Tree';
  import { useTree } from '/@/components/Tree/src/useTree';
  const treeData = ref<TreeItem[]>([]);
  const emit = defineEmits(['select']);
  onMounted(async () => {
    treeData.value = await getCollegeTree();
  });
  const { updateNodeByKey } = useTree(
    treeData,
    computed(() => {
      return { key: 'key', children: 'children', title: 'title' };
    }),
  );
  const handleSelect = (keys: string[], event: Event) => {
    emit('select', keys, event);
  };
  const onLoadData = (treeNode: any) => {
    return new Promise(async (resolve: (value?: unknown) => void) => {
      const { eventKey: key } = treeNode;
      const children = await getClassTree({ collegeId: key });
      updateNodeByKey(key, { children });
      resolve();
    });
  };
</script>
