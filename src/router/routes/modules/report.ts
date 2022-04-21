import { LAYOUT } from '../../constant';
import { AppRouteModule } from '../../types';

/*
 * @Author: 黄纯峰
 * @Date: 2022-03-11 00:56:28
 * @LastEditTime: 2022-03-11 01:17:05
 * @Version: 1.0
 * @Description: TODO
 */
const basedata: AppRouteModule = {
  path: '/report',
  name: 'Report',
  component: LAYOUT,
  redirect: '/report/index',
  meta: {
    orderNo: 5,
    icon: 'ant-design:database-outlined',
    title: '健康轨迹',
  },
  children: [
    {
      path: 'index',
      name: 'ReportIndex',
      component: () => import('/@/views/report/Index.vue'),
      meta: {
        title: '运动处方',
        icon: 'ant-design:aliwangwang-outlined',
      },
    },
    {
      path: 'track',
      name: 'ReportTrack',
      component: () => import('/@/views/report/Track.vue'),
      meta: {
        title: '健康轨迹',
        icon: 'ant-design:ant-design-outlined',
      },
    },
  ],
};

export default basedata;
