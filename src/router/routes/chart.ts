import { LAYOUT } from '../constant';
import { AppRouteModule } from '../types';

const basedata: AppRouteModule = {
  path: '/chart',
  name: 'Chart',
  component: LAYOUT,
  redirect: '/chart/college',
  meta: {
    orderNo: 6,
    icon: 'ant-design:database-outlined',
    title: '数据可视化',
  },
  children: [
    {
      path: 'college',
      name: 'ChartCollege',
      component: () => import('/@/views/chart/College.vue'),
      meta: {
        title: '学院数据',
        icon: 'ant-design:aliwangwang-outlined',
      },
    },
    {
      path: 'class',
      name: 'ChartClass',
      component: () => import('/@/views/chart/Class.vue'),
      meta: {
        title: '班级数据',
        icon: 'ant-design:aliwangwang-outlined',
      },
    },
    {
      path: 'student',
      name: 'ChartStudent',
      component: () => import('/@/views/chart/Student.vue'),
      meta: {
        title: '学生数据',
        icon: 'ant-design:aliwangwang-outlined',
      },
    },
  ],
};

export default basedata;
