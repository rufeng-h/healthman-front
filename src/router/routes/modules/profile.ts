import { LAYOUT } from './../../constant';
import { AppRouteModule } from '../../types';

const profile: AppRouteModule = {
  component: LAYOUT,
  path: '/profile',
  name: 'UserProfile',
  redirect: { name: 'UserProfileIndex' },
  meta: {
    icon: 'ant-design:deployment-unit-outlined',
    title: '个人中心',
    orderNo: 100,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'UserProfileIndex',
      component: () => import('/@/views/profile/index.vue'),
      meta: {
        title: '个人中心',
        icon: 'ant-design:deployment-unit-outlined',
      },
    },
  ],
};

export default profile;
