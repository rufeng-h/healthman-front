<template>
  <PageWrapper contentBackground content-full-height dense>
    <template #headerContent>
      <div class="step-form-form">
        <a-steps :current="current">
          <a-step title="填写基本信息" />
          <a-step title="设置成绩评定标准" />
          <a-step title="创建成功" />
        </a-steps>
      </div>
    </template>

    <div class="mt-5">
      <Step1 @next="handleStep1Next" v-show="current === 0" />
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
        v-if="initSetp3"
        :subject="subject"
        :score-sheet="scoreSheet"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs } from 'vue';
  import Step1 from './Step1.vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';
  import { PageWrapper } from '/@/components/Page';
  import { Steps } from 'ant-design-vue';
  import { defaultLevel, SubjectInfo, ScoreSheetItem } from './data';

  export default defineComponent({
    name: 'FormStepPage',
    components: {
      Step1,
      Step2,
      Step3,
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
    },
    setup() {
      const current = ref(0);

      const state = reactive({
        initSetp2: false,
        initSetp3: false,
      });

      const data = reactive<{ subject: SubjectInfo; scoreSheet: ScoreSheetItem[] }>({
        subject: {
          subName: '',
          level: defaultLevel,
          genders: [],
          grades: [],
        },
        scoreSheet: [],
      });

      function handleStep1Next(step1Values: SubjectInfo) {
        current.value++;
        state.initSetp2 = true;
        Object.assign(data.subject, step1Values);
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
      }

      return {
        current,
        handleStep1Next,
        handleStep2Next,
        handleRedo,
        handleStepPrev,
        ...toRefs(state),
        ...toRefs(data),
      };
    },
  });
</script>
<style lang="less" scoped>
  .step-form-content {
    padding: 24px;
    background-color: @component-background;
  }

  .step-form-form {
    width: 750px;
    margin: 0 auto;
  }
</style>
