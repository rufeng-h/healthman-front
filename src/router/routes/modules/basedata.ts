import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const basedata: AppRouteModule = {
  path: '/basedata',
  name: 'BaseData',
  component: LAYOUT,
  redirect: '/basedata/college',
  meta: {
    orderNo: 1,
    icon: 'ant-design:database-outlined',
    title: '基础数据管理',
  },
  children: [
    {
      path: 'college',
      name: 'BaseDataCollege',
      component: () => import('/@/views/basedata/college/index.vue'),
      meta: {
        title: '学院信息',
        icon: 'ant-design:ant-design-outlined',
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: ':clgCode',
          name: 'BaseDataCollegeDetail',
          component: () => import('/@/views/basedata/college/CollegeDetail.vue'),
          meta: {
            title: '详情',
            hideMenu: true,
            currentActiveMenu: '/basedata/college',
          },
        },
      ],
    },
    {
      path: 'class',
      name: 'BaseDataClass',
      component: () => import('/@/views/basedata/class/index.vue'),
      meta: {
        title: '班级信息',
        icon: 'ant-design:bank-outlined',
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: ':clsCode',
          name: 'BaseDataClassDetail',
          component: () => import('/@/views/basedata/class/ClassDetail.vue'),
          meta: {
            title: '班级详情',
            hideMenu: true,
            currentActiveMenu: '/basedata/class',
          },
        },
      ],
    },
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
      component: () => import('/@/views/basedata/student/index.vue'),
      meta: {
        title: '学生信息',
        icon: 'ant-design:aliwangwang-outlined',
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: ':stuId',
          name: 'BaseDataStudentDetail',
          component: () => import('/@/views/basedata/student/StudentDetail.vue'),
          meta: {
            title: '学生详情',
            hideMenu: true,
            currentActiveMenu: '/basedata/student',
          },
        },
      ],
    },

    {
      path: 'subject',
      name: 'BaseDataSubject',
      component: () => import('/@/views/basedata/subject/index.vue'),
      meta: {
        title: '科目管理',
        icon: 'ant-design:deployment-unit-outlined',
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: 'add',
          name: 'BaseDataSubjectAdd',
          component: () => import('/@/views/basedata/subject/step/index.vue'),
          meta: {
            title: '添加科目',
            hideMenu: true,
            currentActiveMenu: '/basedata/sbuject',
          },
        },
      ],
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
