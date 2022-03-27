<template>
  <div class="w-3/5" style="margin: auto">
    <Alert type="success" message="新增科目成功，以下为科目详细信息" />
    <BasicTable @register="tableRef" />
  </div>
  <Row type="flex" justify="center" class="m-3" :gutter="{ xs: 4, sm: 8, md: 12, lg: 16 }"
    ><Col :xs="8" :lg="4" :md="6">
      <a-button type="primary" @click="redo">继续添加新科目</a-button>
    </Col>
    <Col :xs="8" :lg="4" :md="6">
      <a-button type="primary" @click="leave">返回科目管理界面</a-button>
    </Col>
  </Row>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '/@/components/Table';
  import { scoreSheetColumns, SCORE_SHEET_MAX, SCORE_SHEET_MIN } from '/@/api/scoreSheet';
  import { ScoreSheetItem, SubjectInfo } from './data';
  import { computed, toRefs } from 'vue';
  import { Row, Col, Alert } from 'ant-design-vue';
  import { GenderEnum } from '/@/enums/genderEnum';
  import { gradeMappings } from '/@/enums/gradeEnum';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  const props = defineProps<{ subject: SubjectInfo; scoreSheet: ScoreSheetItem[] }>();
  const emit = defineEmits(['redo']);
  const { subName, subDesp, genders, grades } = toRefs(props.subject);
  const tableData = props.scoreSheet.map((s) => {
    let text = '';
    if (s.upper >= SCORE_SHEET_MAX) {
      text = s.lower + '以上';
    } else if (s.lower <= SCORE_SHEET_MIN) {
      text = s.upper + '以下';
    } else {
      text = s.lower + '~' + s.upper;
    }
    return {
      text,
      ...s,
    };
  });
  const tableTitle = computed(() => {
    let title = grades.value.map((g) => gradeMappings[g]).join('，');
    const set = new Set(genders.value);
    if (set.has(GenderEnum.M)) {
      title += ' 男生';
    }
    if (set.has(GenderEnum.F)) {
      title += ' 女生';
    }
    title += subName.value;
    return title;
  });
  const [tableRef] = useTable({
    title: tableTitle,
    titleHelpMessage: subDesp,
    dataSource: tableData,
    columns: scoreSheetColumns,
    pagination: false,
    canResize: false,
    showTableSetting: false,
  });
  const redo = () => {
    emit('redo');
  };
  const go = useGo();
  const { close: closeTab } = useTabs();
  const leave = () => {
    closeTab();
    go({
      //@ts-ignore
      name: 'BaseDataSubject',
    });
  };
</script>
<style lang="less" scoped>
  .step3 {
    width: 600px;
    margin: 0 auto;
  }

  .desc-wrap {
    padding: 24px 40px;
    margin-top: 24px;
    background-color: @background-color-light;
  }
</style>
