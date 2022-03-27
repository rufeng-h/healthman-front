<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-25 18:09:28
 * @LastEditTime: 2022-03-26 00:08:44
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <a-input
    v-if="inputVisible"
    ref="inputRef"
    type="text"
    :style="{ width: '78px' }"
    v-model:value="inputValue"
    @blur="handleInputConfirm"
    @keyup.enter="handleInputConfirm"
  />
  <a-tag
    v-else
    @click="showInput"
    style="border-style: dashed; font-size: 14px; padding: 3px 7px"
    color="orange"
  >
    <plus-outlined />
    新增
  </a-tag>
  <span v-if="tags.length === 0" style="color: #ccc"> {{ defaultDesp }}</span>
  <a-tag
    v-else
    v-for="tag in tags"
    :key="tag"
    closable
    @close="handleClose(tag)"
    color="green"
    style="font-size: 14px; padding: 3px 7px"
  >
    {{ tag }}
  </a-tag>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs, nextTick } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { Tag, Input } from 'ant-design-vue';

  export default defineComponent({
    components: {
      PlusOutlined,
      [Tag.name]: Tag,
      [Input.name]: Input,
    },
    props: {
      tags: {
        type: Array,
        required: true,
      },
      defaultValue: Array,
    },
    emits: ['update:tags'],
    setup(props, { emit }) {
      const inputRef = ref();
      if (props.tags.length === 0) {
        emit('update:tags', props.defaultValue);
      }
      const state = reactive<{ tags: string[]; inputVisible: boolean; inputValue: string }>({
        tags: props.tags as unknown as string[],
        inputVisible: false,
        inputValue: '',
      });

      const handleClose = (removedTag: string) => {
        const tags = state.tags.filter((tag) => tag !== removedTag);
        state.tags = tags;
      };

      const showInput = () => {
        state.inputVisible = true;
        nextTick(() => {
          inputRef.value.focus();
        });
      };

      const handleInputConfirm = () => {
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue];
        }
        Object.assign(state, {
          tags,
          inputVisible: false,
          inputValue: '',
        });

        state.tags.length === 0
          ? emit('update:tags', props.defaultValue)
          : emit('update:tags', state.tags);
      };
      const defaultDesp = '默认为' + props.defaultValue?.join('、');
      return {
        ...toRefs(state),
        handleClose,
        defaultDesp,
        showInput,
        handleInputConfirm,
        inputRef,
      };
    },
  });
</script>
