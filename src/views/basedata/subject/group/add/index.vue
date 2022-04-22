<template>
  <PageWrapper content-full-height dense content-background>
    <template #headerContent>
      <div class="flex flex-start flex-row flex-wrap">
        <div class="text-xl font-bold">新增科目组</div>
        <div>
          <a-form layout="inline" :rules="rules" ref="formRef" :model="formdata">
            <a-form-item
              name="grpName"
              label="科目组名"
              :wrapperCol="{ span: 18, style: { width: '25rem' } }"
              :labelCol="{ span: 6 }"
              required
            >
              <a-input v-model:value="formdata.grpName" placeholder="请输入名称" />
            </a-form-item>
            <a-form-item
              name="grpDesp"
              label="说明"
              :wrapperCol="{ span: 21, style: { width: '25rem' } }"
              :labelCol="{ span: 3 }"
              required
            >
              <a-input v-model:value="formdata.grpDesp" placeholder="科目组说明" />
            </a-form-item>
          </a-form>
          <a-row class="mt-1">
            <a-col :span="3" class="text-right">已选科目：</a-col>
            <a-col :span="18">
              <div v-if="selectedSubs.length === 0"
                ><a-alert message="请在下方添加科目" show-icon
              /></div>
              <div v-else>
                <a-tag
                  color="blue"
                  v-for="sub in selectedSubs"
                  :key="sub.subId"
                  style="padding: 0.2rem; font-size: 1.1em"
                >
                  {{ sub.subName }}
                </a-tag>
              </div>
            </a-col>
          </a-row>
          <a-row type="flex" justify="end" class="m-3" :gutter="{ xs: 4, sm: 8, md: 12, lg: 8 }">
            <a-col :xs="8" :lg="2" :md="6"><a-button @click="handleReset">重置</a-button></a-col>
            <a-col :xs="8" :lg="2" :md="6"
              ><a-button type="primary" @click="handleSubmit">提交</a-button></a-col
            >
          </a-row>
        </div>
      </div>
    </template>
    <BasicForm @register="subSearchForm" />
    <a-list
      :data-source="dataSource"
      :pagination="pagination"
      :grid="{ gutter: 8, xs: 1, sm: 1, md: 3, lg: 4, xl: 4, xxl: 6 }"
      :loading="loading"
      ><template #renderItem="{ item }">
        <a-list-item>
          <a-card class="!rounded-lg relative" hoverable>
            <div class="font-semibold flex flex-row justify-between">
              <div><a-avatar src="/src/assets/images/logo.png" /> {{ item.subName }}</div>
              <div class="text-center flex align-middle"
                ><a-tag
                  v-if="item.compName !== undefined"
                  color="orange"
                  style="font-size: 1.1em; font-weight: 500; margin: auto auto"
                  >{{ item.compName }}</a-tag
                ></div
              >
            </div>
            <div class="my-2"
              ><a-tooltip :title="item.subDesp"
                ><div class="truncate text-secondary">{{ item.subDesp }}</div></a-tooltip
              ></div
            >
            <div class="flex flex-row justify-between mb-2">
              <div v-if="item.msInfos === undefined || item.msInfos.length === 0">
                <a-tag color="red" style="font-size: 1.1em">暂无体测信息</a-tag>
              </div>
              <div v-else v-for="msInfo in item.msInfos" :key="msInfo.name">
                <a-popover>
                  <template #content>
                    <a-table
                      bordered
                      size="small"
                      row-key="grade"
                      :columns="msInfoColumns"
                      :dataSource="msInfo.value"
                      :pagination="false"
                    >
                      <template #male="{ record }">
                        <Icon v-if="record.M" icon="icon-park:correct" color="green" />
                        <Icon v-else icon="codicon:error" color="red" />
                      </template>
                      <template #female="{ record }">
                        <Icon v-if="record.F" icon="icon-park:correct" color="green" />
                        <Icon v-else icon="codicon:error" color="red" />
                      </template>
                    </a-table>
                  </template>
                  <a-tag color="green" style="font-size: 1.1em">{{ msInfo.name }}</a-tag>
                </a-popover>
              </div>
            </div>
            <div class="flex flex-row justify-between">
              <div class="action">
                <div class="action-item" v-if="item.hasScore">
                  <a-button
                    pre-icon="akar-icons:more-horizontal"
                    class="aciton-icon !bg-blue-400"
                    size="small"
                    shape="circle"
                    @click="handleView(item)"
                /></div>
                <div v-else class="action-item">
                  <a-tooltip title="无成绩标准，请导入">
                    <a-button
                      pre-icon="ep:warning-filled"
                      color="warning"
                      shape="circle"
                      size="small"
                      class="aciton-icon" /></a-tooltip
                ></div>

                <div class="action-item" v-if="formdata.subIds.indexOf(item.subId) === -1">
                  <a-button
                    pre-icon="akar-icons:circle-plus-fill"
                    color="success"
                    class="aciton-icon"
                    shape="circle"
                    size="small"
                    @click="addSubject(item)"
                  />
                </div>
                <div class="action-item" v-else>
                  <a-button
                    pre-icon="akar-icons:circle-minus-fill"
                    color="error"
                    class="aciton-icon"
                    shape="circle"
                    size="small"
                    @click="removeSubject(item)"
                  />
                </div>
              </div>
              <div class="flex flex-col justify-center text-secondary">
                {{ item.subCreated }}
              </div>
            </div>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    Row,
    Col,
    Card,
    List,
    Alert,
    Avatar,
    PaginationProps,
    Form,
    FormItem,
    Tag,
    Popover,
    Tooltip,
    Table,
    Select,
  } from 'ant-design-vue';
  import { SubjectInfoModel, pageSubjectInfo, msInfoColumns, SubjectQuery } from '/@/api/subject';
  import { SubGroupFormdata, addSubGroup } from '/@/api/subgroup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useGo } from '/@/hooks/web/usePage';
  import Icon from '/@/components/Icon';
  import { FormSchema, useForm, BasicForm } from '/@/components/Form';
  import { gradeEnumOptions } from '/@/enums/gradeEnum';
  import { ROUTENAMES } from '/@/router/routes/routeMapping';
  export default defineComponent({
    components: {
      [Tooltip.name]: Tooltip,
      [Table.name]: Table,
      [Tag.name]: Tag,
      [Form.name]: Form,
      [Form.Item.name]: FormItem,
      [Popover.name]: Popover,
      [Avatar.name]: Avatar,
      [Alert.name]: Alert,
      PageWrapper,
      [Card.name]: Card,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Select.name]: Select,
      [Row.name]: Row,
      [Col.name]: Col,
      Icon,
      BasicForm,
    },
    setup() {
      const { createMessage } = useMessage();
      const { close: closeTab } = useTabs();
      const go = useGo();
      const fetchData = async (params: SubjectQuery | undefined = undefined) => {
        if (params === undefined) {
          params = { page: state.pagination.current, pageSize: state.pagination.pageSize };
        }
        try {
          state.loading = true;
          const data = await pageSubjectInfo(params);
          state.dataSource = data.items;
          state.pagination.total = data.total;
          state.pagination.pageSize = data.pageSize;
          state.pagination.current = data.current;
        } finally {
          state.loading = false;
        }
      };
      const state = reactive<{
        dataSource: SubjectInfoModel[];
        pagination: PaginationProps;
        formdata: SubGroupFormdata;
        selectedSubs: SubjectInfoModel[];
        loading: boolean;
      }>({
        dataSource: [],
        pagination: {
          current: 1,
          onChange(page, pageSize) {
            fetchData({ page, pageSize, ...getFieldsValue() });
          },
        },
        formdata: {
          grpName: '',
          grpDesp: '无',
          subIds: [],
        },
        selectedSubs: [],
        loading: false,
      });
      const rules = {
        grpName: [
          {
            required: true,
            message: '请输入科目组名',
            trigger: 'blur',
          },
        ],
        grpDesp: [
          {
            required: true,
            message: '请输入说明信息',
            trigger: 'blur',
          },
        ],
      };
      onMounted(() => fetchData());
      function removeSubject(item) {
        const idx = state.formdata.subIds.indexOf(item.subId);
        if (idx !== -1) {
          state.selectedSubs.splice(idx, 1);
          state.formdata.subIds.splice(idx, 1);
        }
      }
      function addSubject(item) {
        if (state.formdata.subIds.indexOf(item.subId) === -1) {
          state.selectedSubs.push(item);
          state.formdata.subIds.push(item.subId);
        }
      }
      async function handleSubmit() {
        await formRef.value.validate();
        if (state.formdata.subIds.length === 0) {
          createMessage.error('请选择科目!');
          return;
        }
        const key = 'addSubGroup';
        createMessage.loading({ content: '正在添加', key });
        try {
          const data = await addSubGroup(state.formdata);
          if (data) {
            createMessage.success({ content: '添加成功！2秒后跳转到科目组界面...', key });
            setTimeout(() => {
              closeTab();
              go({
                //@ts-ignore
                name: ROUTENAMES.SUBGRP.SUBGRP_INDEX,
              });
            }, 2000);
          }
        } catch (e) {
          createMessage.error({ content: '添加失败', key });
        }
      }
      const searchFormScheme: FormSchema[] = [
        {
          field: 'subName',
          label: '科目名',
          component: 'InputSearch',
          colProps: {
            span: 6,
          },
          componentProps: {
            onSearch() {
              const params = getFieldsValue();
              if (!params.subName) {
                return;
              }
              fetchData(params);
            },
            onChange(e) {
              const value = e.target.value;
              if (value === '') {
                const params = getFieldsValue();
                params.subName = undefined;
                fetchData(params);
              }
            },
            placeholder: '输入科目名搜索',
          },
        },
        {
          field: 'grade',
          label: '年级',
          component: 'Select',
          colProps: {
            span: 6,
          },
          componentProps: {
            placeholder: '选择年级搜索',
            options: gradeEnumOptions,
            onChange(grade) {
              const params = getFieldsValue();
              params.grade = grade;
              fetchData(params);
            },
          },
        },
      ];
      const [subSearchForm, { getFieldsValue }] = useForm({
        labelWidth: 80,
        submitOnReset: false,
        schemas: searchFormScheme,
        showResetButton: false,
        showSubmitButton: false,
        compact: true,
      });
      const formRef = ref();
      function handleView(sub: SubjectInfoModel) {
        go({
          //@ts-ignore
          name: ROUTENAMES.SUBJECT.SUBJECT_DETAIL,
          params: { subId: sub.subId },
        });
      }
      function handleReset() {
        formRef.value.clearValidate();
        Object.assign(state.formdata, { grpName: '', grpDesp: '无', subIds: [] });
        state.selectedSubs = [];
      }
      return {
        subSearchForm,
        formRef,
        rules,
        removeSubject,
        addSubject,
        handleSubmit,
        handleReset,
        handleView,
        ...toRefs(state),
        msInfoColumns,
      };
    },
  });
</script>
<style lang="less" scoped>
  .action {
    margin-top: 0.4rem;
    &-item {
      display: inline-block;
      padding: 0 0.5rem;
      color: @text-color-secondary;

      &:nth-child(1) {
        padding-left: 0;
      }

      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        border-right: 1px solid @border-color-base;
      }
    }

    &-icon {
      margin-right: 0.1rem;
    }
  }

  ::v-deep(.ant-list) {
    margin: 0 0.5rem;
  }

  ::v-deep(.ant-card-body) {
    padding: 1rem;
  }

  ::v-deep(.ant-list-item) {
    margin-bottom: 0.5rem !important;
  }

  ::v-deep(tbody.ant-table-tbody tr.ant-table-row td) {
    padding: 0.2rem !important;
  }

  ::v-deep(.ant-form-item, .ant-form-item-with-help) {
    margin-bottom: 0;
  }

  ::v-deep(.ant-alert) {
    padding: 0.18rem 0;
  }
</style>
