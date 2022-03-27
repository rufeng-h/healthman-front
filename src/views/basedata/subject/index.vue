<template>
  <PageWrapper content-full-height dense content-background content-class="flex">
    <template #headerContent>
      <BasicForm @register="searchForm" @submit="fetchScoreSheet" />
      <a-button type="primary" @click="addSubject">添加新科目</a-button>
    </template>

    <BasicTable @register="tableRefM" class="w-1/2">
      <template #level="{ record }">
        <Tag v-if="record.score >= 80" color="green">{{ record.level }}</Tag>
        <Tag v-else-if="record.score >= 60" color="orange">{{ record.level }}</Tag>
        <Tag v-else color="red">{{ record.level }}</Tag>
      </template>
    </BasicTable>
    <BasicTable @register="tableRefF" class="w-1/2">
      <template #level="{ record }">
        <Tag v-if="record.score >= 80" color="green">{{ record.level }}</Tag>
        <Tag v-else-if="record.score >= 60" color="orange">{{ record.level }}</Tag>
        <Tag v-else color="red">{{ record.level }}</Tag>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { Tag } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import {
    scoreSheetColumns,
    getScoreSheetList,
    ScoreSheetQuery,
    ScoreSheetModel,
    SCORE_SHEET_MAX,
    SCORE_SHEET_MIN,
  } from '/@/api/scoreSheet';
  import { gradeOptions } from '/@/enums/gradeEnum';
  import { getSubjectList } from '/@/api/subject';
  import { ref, Ref } from 'vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { GenderEnum } from '/@/enums/genderEnum';
  import { useGo } from '/@/hooks/web/usePage';
  const helpMessage = ref('');
  const maleSheet: Ref<ScoreSheetModel[]> = ref<ScoreSheetModel[]>([]);
  const femaleSheet: Ref<ScoreSheetModel[]> = ref<ScoreSheetModel[]>([]);
  async function fetchScoreSheet() {
    const sheet: ScoreSheetModel[] = await getScoreSheetList(getFieldsValue() as ScoreSheetQuery);
    const sm: ScoreSheetModel[] = [];
    const sf: ScoreSheetModel[] = [];
    sheet.forEach((s) => {
      if (s.upper >= SCORE_SHEET_MAX) {
        s.text = s.lower + '以上';
      } else if (s.lower <= SCORE_SHEET_MIN) {
        s.text = s.upper + '以下';
      } else {
        s.text = s.lower + '~' + s.upper;
      }
      s.gender === GenderEnum.M ? sm.push(s) : sf.push(s);
    });
    const sortFn = (a, b) => {
      if (a.score === b.score) {
        return b.upper - a.upper;
      }
      return b.score - a.score;
    };
    sm.sort(sortFn);
    sf.sort(sortFn);
    maleSheet.value.length = 0;
    femaleSheet.value.length = 0;
    maleSheet.value.push(...sm);
    femaleSheet.value.push(...sf);
  }

  const formScheme: FormSchema[] = [
    {
      field: 'subjectId',
      label: '科目',
      component: 'ApiSelect',
      colProps: {
        span: 8,
      },
      componentProps: {
        api: getSubjectList,
        immediate: true,
        labelField: 'subName',
        valueField: 'subId',
        showSearch: true,
        onSelect(_, opt) {
          console.log(opt);
          if (opt.subDesp) {
            helpMessage.value = opt.subDesp;
          }
        },
      },
      required: true,
    },
    {
      field: 'grade',
      label: '年级',
      component: 'Select',
      colProps: {
        span: 8,
      },
      componentProps: {
        options: gradeOptions,
      },
      required: true,
    },
  ];
  const [searchForm, { getFieldsValue }] = useForm({
    submitOnReset: false,
    labelWidth: 100,
    showAdvancedButton: true,
    compact: true,
    schemas: formScheme,
  });
  const [tableRefM, __] = useTable({
    columns: scoreSheetColumns,
    rowKey: 'id',
    striped: true,
    pagination: false,
    dataSource: maleSheet.value,
    immediate: false,
    showTableSetting: true,
    showIndexColumn: false,
    tableSetting: { fullScreen: false, setting: false },
    title: '男生评分标准',
    titleHelpMessage: helpMessage,
    bordered: true,
  });
  const [tableRefF, ___] = useTable({
    columns: scoreSheetColumns,
    rowKey: 'id',
    striped: true,
    pagination: false,
    dataSource: femaleSheet.value,
    immediate: false,
    showTableSetting: true,
    showIndexColumn: false,
    tableSetting: { fullScreen: false, setting: false },
    title: '女生评分标准',
    titleHelpMessage: helpMessage,
    bordered: true,
  });
  const go = useGo();
  function addSubject() {
    go({
      //@ts-ignore
      name: 'BaseDataSubjectAdd',
    });
  }
</script>
