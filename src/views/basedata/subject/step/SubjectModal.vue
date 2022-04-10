<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    dialogClass="!sm:w-full !md:w-full !lg:w-3/5"
    :height="450"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    @cancel="resetValues"
  >
    <PageWrapper contentBackground content-full-height dense>
      <template #headerContent>
        <div class="mx-auto lg:w-4/5">
          <a-steps :current="current">
            <a-step title="填写基本信息" />
            <a-step title="设置成绩评定标准" />
            <a-step title="创建成功" />
          </a-steps>
        </div>
      </template>

      <div class="mt-5">
        <Step1
          ref="step1Ref"
          @next="handleStep1Next"
          v-show="current === 0"
          v-model:subject="subject"
        />
        <Step2
          @prev="handleStepPrev"
          @next="handleStep2Next"
          v-show="current === 1"
          v-if="initSetp2"
          :subject="subject"
        />
        <Step3
          v-show="current === 2"
          @redo="handleRedo"
          @complete="compelete"
          v-if="initSetp3"
          :subject="subject"
          :score-sheet="scoreSheet"
        />
      </div>
    </PageWrapper>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs } from 'vue';
  import Step1 from './Step1.vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';
  import { PageWrapper } from '/@/components/Page';
  import { Steps } from 'ant-design-vue';
  import { defaultLevel, SubjectInfo, ScoreSheetItem } from './data';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  export default defineComponent({
    name: 'FormStepPage',
    components: {
      Step1,
      Step2,
      Step3,
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
      BasicModal,
    },
    setup() {
      const current = ref(0);

      const state = reactive({
        initSetp2: false,
        initSetp3: false,
      });
      const DEFAULT_SUB = {
        subName: '',
        level: defaultLevel,
        genders: [],
        grades: [],
      };
      const step1Ref = ref();
      const [registerModal, { closeModal }] = useModalInner();

      const data = reactive<{ subject: SubjectInfo; scoreSheet: ScoreSheetItem[] }>({
        subject: DEFAULT_SUB,
        scoreSheet: [],
      });

      function handleStep1Next(subjectInfo: SubjectInfo) {
        current.value++;
        state.initSetp2 = true;
        data.subject = subjectInfo;
      }

      function handleStepPrev() {
        current.value--;
      }

      function handleStep2Next(scoreSheet: ScoreSheetItem[]) {
        current.value++;
        state.initSetp3 = true;
        data.scoreSheet = scoreSheet;
      }

      function handleRedo() {
        current.value = 0;
        state.initSetp2 = false;
        state.initSetp3 = false;
        resetValues();
      }

      function compelete() {
        closeModal();
      }

      function resetValues() {
        data.subject = DEFAULT_SUB;
        step1Ref.value.formRef.resetFields();
      }

      return {
        current,
        handleStep1Next,
        handleStep2Next,
        handleRedo,
        handleStepPrev,
        ...toRefs(state),
        ...toRefs(data),
        registerModal,
        compelete,
        resetValues,
        step1Ref,
      };
    },
  });
</script>
