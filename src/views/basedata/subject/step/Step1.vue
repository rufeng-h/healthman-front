<template>
  <div class="w-3/5" style="margin: auto">
    <BasicForm @register="register">
      <template #level="{ model, field }">
        <TagAdd v-model:tags="model[field]" :default-value="defaultLevel" />
      </template>
    </BasicForm>
  </div>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form';
  import { step1Schemas, defaultLevel } from './data';
  import TagAdd from './TagAdd.vue';
  const emit = defineEmits(['next']);

  const [register, { validate }] = useForm({
    labelWidth: 100,
    schemas: step1Schemas,
    actionColOptions: {
      span: 14,
    },
    showResetButton: false,
    submitButtonOptions: {
      text: '下一步',
    },
    submitFunc: customSubmitFunc,
  });
  async function customSubmitFunc() {
    try {
      const values = await validate();
      console.log(values);
      emit('next', values);
    } catch (error) {}
  }
</script>
