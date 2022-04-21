import { LAYOUT } from '../../constant';
import { AppRouteModule } from '../../types';

/*
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:58:03
 * @LastEditTime: 2022-03-11 01:16:48
 * @Version: 1.0
 * @Description: TODO
 */
const basedata: AppRouteModule = {
  path: '/statistic',
  name: 'Statistic',
  component: LAYOUT,
  redirect: '/statistic/college',
  meta: {
    orderNo: 4,
    icon: 'ant-design:database-outlined',
    title: '数据统计',
  },
  children: [
    {
      path: 'college',
      name: 'StatisticCollege',
      component: () => import('/@/views/statistic/College.vue'),
      meta: {
        title: '学院数据统计',
        icon: 'ant-design:aliwangwang-outlined',
      },
    },
    {
      path: 'class',
      name: 'StatisticClass',
      component: () => import('/@/views/statistic/Class.vue'),
      meta: {
        title: '班级数据统计',
        icon: 'ant-design:ant-design-outlined',
      },
    },
  ],
};

export default basedata;
