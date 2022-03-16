import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';

const basedata: AppRouteModule = {
  path: '/basedata',
  name: 'BaseData',
  component: LAYOUT,
  redirect: '/basedata/user/admin',
  meta: {
    orderNo: 1,
    icon: 'ant-design:database-outlined',
    title: '基础数据管理',
  },
  children: [
    {
      path: 'user',
      name: 'BaseDataUser',
      component: getParentLayout('BaseDataUser'),
      redirect: '/basedata/user/admin',
      meta: {
        title: '用户管理',
        icon: 'ant-design:aliwangwang-outlined',
      },
      children: [
        {
          path: 'admin',
          name: 'BaseDataAdmin',
          component: () => import('/@/views/basedata/account/Admin.vue'),
          meta: {
            title: '管理员信息',
            icon: 'ant-design:aliwangwang-outlined',
          },
        },
        {
          path: 'student',
          name: 'BaseDataStudent',
          component: () => import('/@/views/basedata/account/Student.vue'),
          meta: {
            title: '学生信息',
            icon: 'ant-design:aliwangwang-outlined',
          },
        },
      ],
    },
    {
      path: 'college',
      name: 'BaseDataCollege',
      component: () => import('/@/views/basedata/college/index.vue'),
      meta: {
        title: '学院信息',
        icon: 'ant-design:ant-design-outlined',
      },
    },
    {
      path: 'class',
      name: 'BaseDataClass',
      component: () => import('/@/views/basedata/class/index.vue'),
      meta: {
        title: '班级信息',
        icon: 'ant-design:bank-outlined',
      },
    },
    {
      path: 'subject',
      name: 'BaseDataSubject',
      component: () => import('/@/views/basedata/subject/index.vue'),
      meta: {
        title: '科目管理',
        icon: 'ant-design:deployment-unit-outlined',
      },
    },
    {
      path: 'profile',
      name: 'BaseDataProfile',
      component: () => import('/@/views/basedata/profile/index.vue'),
      meta: {
        title: '个人中心',
        icon: 'ant-design:deployment-unit-outlined',
      },
    },
  ],
};

export default basedata;
