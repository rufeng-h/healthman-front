<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="分享科目组"
    @ok="handleSubmit"
    width="50%"
    :min-height="400"
  >
    <Transfer
      show-search
      :data-source="teaOptions"
      :render="(item) => item.title"
      :target-keys="targetKeys"
      :selected-keys="selectedKeys"
      :filter-option="filterOption"
      :list-style="{ width: '45%', height: '30rem' }"
      @change="handleChange"
      @select-change="handleSelectChange"
    />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { listTeacher } from '/@/api/teacher';
  import { Transfer } from 'ant-design-vue';
  import { SubGroupInfoModel } from '/@/api/subgroup';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'ShareModal',
    components: { BasicModal, Transfer },
    emits: ['submit', 'register'],
    setup(_, { emit }) {
      const state: { teaOptions: any; targetKeys: any; selectedKeys: any; grpId: number } =
        reactive({
          teaOptions: undefined,
          targetKeys: [],
          selectedKeys: [],
          grpId: -1,
        });
      const userInfo = useUserStore().getUserInfo;

      const [registerModal, { closeModal }] = useModalInner(async (record: SubGroupInfoModel) => {
        if (state.teaOptions === undefined) {
          /* 去除自己 */
          const data = (await listTeacher()).filter((tea) => tea.teaId !== userInfo.userId);
          data.sort((a, b) => (a.teaId > b.teaId ? 1 : -1));
          state.teaOptions = data.map((tea) => {
            return {
              title: tea.clgName
                ? `${tea.clgName} ${tea.teaId} ${tea.teaName}`
                : `${tea.teaId} ${tea.teaName}`,
              key: tea.teaId,
            };
          });
        }
        state.grpId = record.grpId;
        state.targetKeys = [];
        state.selectedKeys = [];

        if (record.sharedTeaIds) {
          state.targetKeys = record.sharedTeaIds;
        }
      });

      const handleChange = (nextTargetKeys: string[]) => {
        state.targetKeys = nextTargetKeys;
      };
      const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        state.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
      };
      const filterOption = (value, opt) => {
        return opt.title.indexOf(value) > -1;
      };

      async function handleSubmit() {
        emit('submit', { teaIds: state.targetKeys, grpId: state.grpId });
        closeModal();
      }

      return {
        filterOption,
        handleSubmit,
        registerModal,
        ...toRefs(state),
        handleChange,
        handleSelectChange,
      };
    },
  });
</script>

<style scoped lang="less"></style>
