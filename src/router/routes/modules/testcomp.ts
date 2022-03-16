/*
 * @Author: 黄纯峰
 * @Date: 2022-03-10 17:34:38
 * @LastEditTime: 2022-03-13 21:36:29
 * @Version: 1.0
 * @Description: TODO
 */
import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const dashboard: AppRouteModule = {
  path: '/testcomp',
  name: 'TestComp',
  component: LAYOUT,
  redirect: '/testcomp/button',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: '测试组件',
  },
  children: [
    {
      path: 'button',
      name: 'TestButton',
      component: () => import('/@/views/testcomp/TestButton.vue'),
      meta: {
        title: '测试按钮',
      },
    },
    {
      path: 'basicForm',
      name: 'TestBasicForm',
      component: () => import('/@/views/testcomp/form/TestBasicForm.vue'),
      meta: {
        title: '测试基础表单',
      },
    },
    {
      path: 'select',
      name: 'TestSelect',
      component: () => import('/@/views/testcomp/TestSelect.vue'),
      meta: {
        title: '测试基础表单',
      },
    },
    {
      path: 'tree',
      name: 'TestTree',
      component: () => import('/@/views/testcomp/TestTree.vue'),
      meta: {
        title: '测试树',
      },
    },
  ],
};

export default dashboard;
