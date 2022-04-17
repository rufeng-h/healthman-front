<template
  ><BasicModal
    v-bind="$attrs"
    @register="registerModal"
    @cancel="cancel"
    @ok="submit"
    :title="modalTitle"
  >
    <BasicForm @register="registerForm">
      <template #subStudents="{ model, field }">
        <a-tabs defaultActiveKey="primary" size="small">
          <a-tab-pane v-for="item in model[field]" :key="item.name" :tab="item.name">
            <TableSelect v-model:subStudents="item.value" />
          </a-tab-pane>
        </a-tabs>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { cloneDeep } from 'lodash';
  import { defineComponent, reactive, toRefs } from 'vue';
  import { listCompetency } from '/@/api/competency';
  import { FormSchema, useForm, BasicForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { gradeMappings, zhCnToNumberGrade } from '/@/enums/gradeEnum';
  import TableSelect from './TableSelect.vue';
  import { SubStuSelect, SubStuSelectItem } from './prop';
  import { Form, Tabs } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'SubjectModal',
    components: {
      TableSelect,
      BasicModal,
      BasicForm,
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [Tabs.name]: Tabs,
      [Tabs.TabPane.name]: Tabs.TabPane,
    },
    emits: ['submit', 'register'],
    setup(_, { emit }) {
      const { createConfirm } = useMessage();
      const defaultSubStus: SubStuSelect[] = [
        { name: '小学', value: [] },
        { name: '初中', value: [] },
        { name: '高中', value: [] },
        { name: '大学', value: [] },
      ];
      Object.keys(gradeMappings).forEach((key) => {
        const grade = parseInt(key);
        const item: SubStuSelectItem = {
          grade: gradeMappings[key],
          M: false,
          F: false,
        };
        if (grade <= 6) {
          defaultSubStus[0].value.push(item);
        } else if (grade <= 9) {
          defaultSubStus[1].value.push(item);
        } else if (grade <= 12) {
          defaultSubStus[2].value.push(item);
        } else {
          defaultSubStus[3].value.push(item);
        }
      });
      type StateType = {
        isUpdate: boolean;
        subId: undefined | number;
        modalTitle: string;
      };
      const state = reactive<StateType>({
        isUpdate: false,
        subId: undefined,
        modalTitle: '',
      });
      const formSchema: FormSchema[] = [
        {
          field: 'subName',
          component: 'Input',
          label: '科目名称',
          rules: [
            {
              required: true,
              message: '请输入科目名称',
              trigger: 'blur',
            },
          ],
        },
        {
          field: 'compId',
          component: 'ApiSelect',
          componentProps: {
            api: listCompetency,
            labelField: 'compName',
            valueField: 'compId',
          },
          label: '运动能力',
          required: false,
        },
        {
          field: 'subDesp',
          component: 'InputTextArea',
          label: '备注信息',
          required: true,
          defaultValue: '无',
        },
        {
          field: 'subStudents',
          slot: 'subStudents',
          component: 'Select',
          label: '参与测试',
          rules: [
            {
              type: 'array',
              required: true,
              validator: async (_, value) => {
                let pass = false;
                value.forEach((v) => {
                  v.value.forEach((s) => {
                    pass = pass || s.M || s.F;
                  });
                });
                if (pass) {
                  return Promise.resolve();
                }
                return Promise.reject('请选择测试对象');
              },
            },
          ],
          defaultValue: cloneDeep(defaultSubStus),
        },
      ];
      const [registerForm, { validate, resetFields, setFieldsValue, clearValidate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        actionColOptions: {
          span: 10,
        },
        showResetButton: false,
        showSubmitButton: false,
      });
      const [registerModal, { closeModal }] = useModalInner((data) => {
        resetFields();
        clearValidate('subStudents');
        const subStus = cloneDeep(defaultSubStus);
        state.isUpdate = !!data?.isUpdate;
        if (state.isUpdate) {
          state.modalTitle = '更新科目';
          const { sub } = data;
          state.subId = sub.subId;
          sub.subStudents.forEach((s) => {
            if (s.grade <= 6) {
              subStus[0].value[s.grade - 1][s.gender] = true;
            } else if (s.grade <= 9) {
              subStus[1].value[s.grade - 7][s.gender] = true;
            } else if (s.grade <= 12) {
              subStus[2].value[s.grade - 10][s.gender] = true;
            } else {
              subStus[3].value[s.grade - 13][s.gender] = true;
            }
          });
          const { subName, subDesp, compId } = sub;
          setFieldsValue({ subName, subDesp, compId, subStudents: subStus });
        } else {
          setFieldsValue({ subStudents: subStus });
          state.modalTitle = '添加新科目';
        }
      });
      function cancel() {
        closeModal();
      }
      async function submit() {
        const values = await validate();
        createConfirm({
          iconType: 'warning',
          content: '添加后请导入对应的评分标准！删除测试对象会删除其评分标准！',
          onOk() {
            const subStudents: any = [];
            values.subStudents.forEach((s) => {
              s.value.forEach((item) => {
                if (item.M) {
                  subStudents.push({ grade: zhCnToNumberGrade(item.grade), gender: 'M' });
                }
                if (item.F) {
                  subStudents.push({ grade: zhCnToNumberGrade(item.grade), gender: 'F' });
                }
              });
            });
            values.subStudents = subStudents;
            emit('submit', {
              isUpdate: state.isUpdate,
              sub: state.isUpdate ? { ...values, subId: state.subId } : values,
            });
            closeModal();
          },
        });
      }

      return {
        registerModal,
        registerForm,
        cancel,
        submit,
        ...toRefs(state),
      };
    },
  });
</script>

<style>
  #subStudents > div {
    width: 100%;
  }
</style>
