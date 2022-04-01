<template>
  <PageWrapper content-full-height>
    <template #headerContent>
      <a-form layout="inline" :rules="rules" ref="formRef" :model="formdata">
        <a-form-item
          name="grpName"
          label="科目组名"
          :wrapperCol="{ span: 18, style: { width: '30rem' } }"
          :labelCol="{ span: 6 }"
          required
        >
          <a-input v-model:value="formdata.grpName" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item
          name="grpDesp"
          label="说明"
          :wrapperCol="{ span: 20, style: { width: '30rem' } }"
          :labelCol="{ span: 4 }"
          required
        >
          <a-input v-model:value="formdata.grpDesp" placeholder="科目组说明" />
        </a-form-item>
        <a-button type="primary" @click="handleSubmit">确认提交</a-button>
      </a-form>

      <a-row class="my-4 mx-16 h-4" type="flex" justify="center" :gutter="16">
        <a-col
          v-if="selectedSubs.length === 0"
          style="color: #ccc; font-size: 1.2em; font-weight: 700"
          :span="4"
          >请在下方选择科目</a-col
        >
        <a-col v-else v-for="sub in selectedSubs" :key="sub.subId" :span="2">
          <a-tag color="orange" style="font-size: 1.1em; padding: 0.2rem">
            {{ sub.subName }}
          </a-tag>
        </a-col>
      </a-row>
    </template>

    <BasicForm @register="subSearchForm" />
    <a-list
      style="margin-top: -2rem"
      :grid="{
        gutter: 8,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 3,
        type: 'flex',
        justify: 'center',
        align: 'center',
      }"
      rowKey="subId"
      :data-source="dataSource"
      :pagination="pagination"
    >
      <template #renderItem="{ item }">
        <a-list-item
          ><a-card hoverable bordered>
            <template #cover>
              <img alt="cover" src="https://www.swjtu.edu.cn/images/logo.png" />
            </template>
            <template #actions>
              <ellipsis-outlined key="ellipsis" style="color: green" />
              <plus-circle-outlined
                key="plus-circle"
                @click="addSubject(item)"
                style="color: #308ecc"
                v-if="formdata.subIds.indexOf(item.subId) === -1"
              />
              <minus-circle-outlined
                key="minus-circle"
                @click="delSubject(item)"
                style="color: salmon"
                v-else
              />
            </template>
            <a-card-meta :title="item.subName" :description="item.subDesp">
              <template #avatar>
                <a-avatar src="/src/assets/images/logo.png" />
              </template>
            </a-card-meta>
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
    Card,
    List,
    Alert,
    Avatar,
    PaginationProps,
    Form,
    FormItem,
    Row,
    Col,
    Tag,
  } from 'ant-design-vue';
  import { PlusCircleOutlined, EllipsisOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
  import BasicForm from '/@/components/Form/src/BasicForm.vue';
  import { FormSchema, useForm } from '/@/components/Form';
  import { SubjectInfoModel, pageSubjectInfo } from '/@/api/subject';
  import { SubGroupFormdata, addSubGroup } from '/@/api/subgroup';
  import { gradeOptions } from '/@/enums/gradeEnum';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useGo } from '/@/hooks/web/usePage';

  export default defineComponent({
    components: {
      [Tag.name]: Tag,
      [Row.name]: Row,
      [Col.name]: Col,
      [Form.name]: Form,
      [Form.Item.name]: FormItem,
      PlusCircleOutlined,
      EllipsisOutlined,
      MinusCircleOutlined,
      [Avatar.name]: Avatar,
      [Alert.name]: Alert,
      PageWrapper,
      [Card.name]: Card,
      [Card.Meta.name]: Card.Meta,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [List.Item.Meta.name]: List.Item.Meta,
      BasicForm,
    },
    setup() {
      const { createMessage } = useMessage();
      const { close: closeTab } = useTabs();
      const go = useGo();
      const DEFAULT_PAGE_SIZE = 6;
      const fetchData = async (params) => {
        const data = await pageSubjectInfo(params);
        state.dataSource = data.items;
        state.pagination.total = data.total;
        state.pagination.pageSize = data.pageSize;
        state.pagination.current = data.current;
      };
      const state = reactive<{
        dataSource: SubjectInfoModel[];
        pagination: PaginationProps;
        formdata: SubGroupFormdata;
        selectedSubs: SubjectInfoModel[];
      }>({
        dataSource: [],
        pagination: {
          current: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          defaultPageSize: DEFAULT_PAGE_SIZE,
          onChange(page, pageSize) {
            fetchData({ page, pageSize });
          },
        },
        formdata: {
          grpName: '',
          grpDesp: '',
          subIds: [],
        },
        selectedSubs: [],
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
      onMounted(() => fetchData({ pageSize: DEFAULT_PAGE_SIZE }));
      const searchFormScheme: FormSchema[] = [
        {
          field: 'subName',
          label: '科目名',
          component: 'InputSearch',
          colProps: {
            span: 8,
          },
          componentProps: {
            onSearch() {
              fetchData(getFieldsValue());
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
            span: 8,
          },
          componentProps: {
            placeholder: '选择年级搜索',
            options: gradeOptions,
            // onSelect() {
            //   fetchData(getFieldsValue());
            // },
            onChange(grade) {
              const params = getFieldsValue();
              if (grade === undefined) {
                params.grade = undefined;
              }
              fetchData(params);
            },
          },
        },
      ];
      const [subSearchForm, { getFieldsValue }] = useForm({
        labelWidth: 80,
        submitOnReset: false,
        schemas: searchFormScheme,
        compact: true,
        showAdvancedButton: false,
        showResetButton: false,
        showSubmitButton: false,
        actionColOptions: {
          span: 24,
        },
      });
      function delSubject(item) {
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
        await addSubGroup(state.formdata);
        createMessage.success('添加成功！2秒后跳转到科目组界面...');
        setTimeout(() => {
          closeTab(),
            go({
              //@ts-ignore
              name: 'BaseDataSubjectGroup',
            });
        }, 2000);
      }
      const formRef = ref();
      return {
        formRef,
        rules,
        subSearchForm,
        delSubject,
        addSubject,
        handleSubmit,
        ...toRefs(state),
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-spin-container) {
    background-color: white;
  }

  ::v-deep(.ant-card-cover) {
    background-color: #308ecc;
  }

  ::v-deep(.ant-card-meta-title) {
    font-weight: 600;
    font-size: 1.2em;
  }

  ::v-deep(.ant-card-meta-description) {
    font-size: 0.9em;
  }

  ::v-deep(.ant-card-actions) {
    height: 2rem !important;

    li {
      height: 20px !important;
      margin-top: 0;
      margin-bottom: 0;
    }
  }
</style>
