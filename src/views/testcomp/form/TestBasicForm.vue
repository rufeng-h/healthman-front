<!--
 * @Author: 黄纯峰
 * @Date: 2022-03-10 18:28:27
 * @LastEditTime: 2022-03-10 21:54:20
 * @Version: 1.0
 * @Description: TODO
-->
<template>
  <PageWrapper title="表单基础示例" :content-style="{ margin: '0.3rem' }">
    <CollapseContainer trigger-window-resize :loading="loading">
      <Divider>基础表单</Divider>
      <BasicForm
        :schemas="schemas"
        :show-reset-button="false"
        :show-submit-button="true"
        :submit-button-options="{ title: '提交', ghost: true, shape: 'round', text: '你好' }"
      />
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Divider } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container';
  import { BasicForm, FormSchema } from '/@/components/Form';
  export default defineComponent({
    components: {
      PageWrapper,
      Divider,
      CollapseContainer,
      BasicForm,
    },
    setup() {
      const loading = ref(true);
      const schemas: FormSchema[] = [
        {
          field: 'number',
          component: 'Input',
          label: '学号',
          helpMessage: '输入10位学号',
          colProps: {
            span: 5,
          },
          suffix: '后缀',
          defaultValue: '1',
          componentProps: {
            placeholder: '自定义placeholder',
            onChange: (e) => {
              console.log(e);
            },
          },
        },
      ];
      setTimeout(() => (loading.value = false), 1000);
      return {
        loading,
        schemas,
      };
    },
  });
</script>
