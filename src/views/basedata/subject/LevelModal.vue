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
    title="新增评分等级"
    okText="确认"
    :min-height="50"
    cancelText="取消"
    :canFullscreen="false"
    @ok="submit"
  >
    <a-form layout="horizontal" :model="state" :rules="rules" ref="formRef">
      <a-form-item
        label="请输入等级"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        name="level"
      >
        <a-input v-model:value="state.level" required />
      </a-form-item>
    </a-form>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';

  import { useModalInner } from '/@/components/Modal';
  import { BasicModal } from '/@/components/Modal';
  import { Input, Form } from 'ant-design-vue';

  export default defineComponent({
    name: 'LevelModal',
    components: { BasicModal, [Input.name]: Input, [Form.name]: Form, [Form.Item.name]: Form.Item },
    emits: ['submit', 'register'],
    setup(_, { emit }) {
      const formRef = ref();
      let levels: Set<string> = new Set();
      const rules = {
        level: [
          { required: true, message: '请输入等级', trigger: 'blur' },
          {
            validator: async (_, value: string) => {
              if (levels.has(value)) {
                return Promise.reject('等级已存在!');
              }
              return Promise.resolve();
            },
            trigger: 'change',
          },
        ],
      };
      type StateType = {
        level: string;
      };
      const state = reactive<StateType>({
        level: '',
      });
      const [registerModal, { closeModal }] = useModalInner((ls: string[]) => {
        formRef.value.resetFields();
        ls.forEach((l) => {
          if (!levels.has(l)) {
            levels.add(l);
          }
        });
      });
      async function submit() {
        const values = await formRef.value.validateFields();

        emit('submit', values.level);
        closeModal();
      }
      return {
        registerModal,
        submit,
        state,
        rules,
        formRef,
      };
    },
  });
</script>
