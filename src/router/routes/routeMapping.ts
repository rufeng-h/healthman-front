import { AppRouteRecordRaw } from './../types';
import { LAYOUT } from '../constant';
import { AppRouteModule } from '/@/router/types';

export const ROUTENAMES: Recordable<Recordable<string>> = {
  BASEDATA: {
    COLLEGE_INDEX: 'COLLEGE_INDEX',
    COLLEGE_DETAIL: 'COLLEGE_DETAIL',
    CLASS_INDEX: 'CLASS_INDEX',
    CLASS_DETAIL: 'CLASS_DETAIL',
    TEACHAER_INDEX: 'TEACHER_INDEX',
    STUDENT_INDEX: 'STUDENT_INDEX',
    STUDENT_DETAIL: 'STUDENT_DETAIL',
  },
  SUBJECT: {
    SUBJECT_INDEX: 'SUBJCET_INDEX',
    SUBJECT_DETAIL: 'SUBJECT_DETAIL',
    SUBGRP_INDEX: 'SUBGRP_INDEX',
    SUBGRP_ADD: 'SUBGRP_ADD',
  },
  MS: {
    MS_INDEX: 'MS_INDEX',
    MS_DETAIL: 'MS_DETAIL',
  },
};

/* 科目组添加 */
const subGrpAdd: AppRouteRecordRaw = {
  path: 'add',
  name: ROUTENAMES.SUBJECT.SUBGRP_ADD,
  component: () => import('/@/views/basedata/subject/group/add/index.vue'),
  meta: {
    title: '添加科目组',
    icon: 'ant-design:deployment-unit-outlined',
    hideMenu: true,
  },
};

/* 科目详情页 */
const subjectDetail: AppRouteRecordRaw = {
  path: ':subId',
  component: () => import('/@/views/basedata/subject/Detail.vue'),
  name: ROUTENAMES.SUBJECT.SUBJECT_DETAIL,
  meta: {
    title: '科目详情',
    hideMenu: true,
    icon: 'ant-design:deployment-unit-outlined',
  },
};
/* 科目列表页 */
const subjectIndex: AppRouteRecordRaw = {
  path: 'index',
  component: () => import('/@/views/basedata/subject/index.vue'),
  name: ROUTENAMES.SUBJECT.SUBJECT_INDEX,
  meta: {
    title: '科目信息',
    icon: 'ant-design:deployment-unit-outlined',
  },
};
/* 科目组列表页 */
const subGrpIndex: AppRouteRecordRaw = {
  path: 'group',
  name: ROUTENAMES.SUBJECT.SUBGRPINDEX,
  component: () => import('/@/views/basedata/subject/group/index.vue'),
  meta: {
    title: '科目组信息',
    icon: 'ant-design:deployment-unit-outlined',
    hideChildrenInMenu: true,
  },
};
/* 学生详情页 */
const studentDetail: AppRouteRecordRaw = {
  path: ':stuId',
  name: ROUTENAMES.BASEDATA.STUDENT_DETAIL,
  component: () => import('/@/views/basedata/student/StudentDetail.vue'),
  meta: {
    title: '学生详情',
    hideMenu: true,
    currentActiveMenu: '/ms/stu',
  },
};
/* 体测列表页 */
const msIndex = {
  path: 'index',
  name: ROUTENAMES.MS.MS_INDEX,
  component: () => import('/@/views/basedata/measurement/index.vue'),
  meta: {
    title: '体测信息',
    icon: 'ant-design:aliwangwang-outlined',
    hideChildrenInMenu: true,
  },
};
/* 体测详情页 */
const msDetail = {
  path: ':msId',
  component: () => import('/@/views/basedata/measurement/Detail.vue'),
  name: ROUTENAMES.MS.MS_DETAIL,
  meta: {
    title: '体测详情',
    hideMenu: true,
  },
};
/* 学院列表页 */
const collegeIndex = {
  path: 'clg',
  name: ROUTENAMES.BASEDATA.COLLEGE_INDEX,
  component: () => import('/@/views/basedata/college/index.vue'),
  meta: {
    title: '学院信息',
    icon: 'ant-design:ant-design-outlined',
    hideChildrenInMenu: true,
  },
};
const collegeDetail = {
  path: ':clgCode',
  name: ROUTENAMES.BASEDATA.COLLEGE_DETAIL,
  component: () => import('/@/views/basedata/college/CollegeDetail.vue'),
  meta: {
    title: '详情',
    hideMenu: true,
    currentActiveMenu: '/basedata/clg',
  },
};
const classIndex = {
  path: 'cls',
  name: ROUTENAMES.BASEDATA.CLASS_INDEX,
  component: () => import('/@/views/basedata/class/index.vue'),
  meta: {
    title: '班级信息',
    icon: 'ant-design:bank-outlined',
    hideChildrenInMenu: true,
  },
};
const classDetail = {
  path: ':clsCode',
  name: ROUTENAMES.BASEDATA.CLASS_DETAIL,
  component: () => import('/@/views/basedata/class/ClassDetail.vue'),
  meta: {
    title: '班级详情',
    hideMenu: true,
    currentActiveMenu: '/basedata/cls',
  },
};
export function teaRoutes() {
  const basedata: AppRouteModule = {
    path: '/basedata',
    name: 'Basedata',
    component: LAYOUT,
    redirect: { name: collegeIndex.name },
    meta: {
      orderNo: 1,
      icon: 'ant-design:database-outlined',
      title: '基础数据管理',
    },
    children: [
      collegeIndex,
      collegeDetail,
      classIndex,
      classDetail,
      {
        path: 'tea',
        name: ROUTENAMES.BASEDATA.TEACHER_INDEX,
        component: () => import('/@/views/basedata/account/Teacher.vue'),
        meta: {
          title: '教师信息',
          icon: 'ant-design:aliwangwang-outlined',
        },
      },
      {
        path: 'stu',
        name: ROUTENAMES.BASEDATA.STUDENT_INDEX,
        component: () => import('/@/views/basedata/student/index.vue'),
        meta: {
          title: '学生信息',
          icon: 'ant-design:aliwangwang-outlined',
          hideChildrenInMenu: true,
        },
        children: [studentDetail],
      },
    ],
  };
  const subject: AppRouteModule = {
    path: '/sub',
    name: 'Subject',
    redirect: { name: subjectIndex.name },
    component: LAYOUT,
    meta: {
      orderNo: 2,
      title: '科目管理',
      icon: 'ant-design:deployment-unit-outlined',
    },
    children: [subjectIndex, subjectDetail, subGrpIndex, subGrpAdd],
  };
  const measurement: AppRouteModule = {
    path: '/ms',
    name: 'Measurement',
    component: LAYOUT,
    redirect: '/ms/index',
    meta: {
      hideChildrenInMenu: true,
      title: '体测管理',
      orderNo: 3,
      icon: 'ant-design:aliwangwang-outlined',
    },
    children: [msIndex, msDetail, studentDetail],
  };

  return [basedata, subject, measurement];
}

export function studentRoutes(stuId: string): AppRouteModule[] {
  /* 科目 */
  const subject: AppRouteModule = {
    name: 'Subject',
    path: '/subject',
    component: LAYOUT,
    redirect: { name: subjectIndex.name },
    meta: {
      hideChildrenInMenu: true,
      title: '科目信息',
      icon: 'ant-design:deployment-unit-outlined',
    },
    children: [subjectDetail, subjectIndex],
  };
  /* 学生体测详情 */
  const student: AppRouteModule = {
    name: 'stuMs',
    path: '/ms/stu',
    component: LAYOUT,
    /* redirect个人页面 */
    redirect: { name: studentDetail.name, params: { stuId } },
    meta: {
      title: '我的体测',
      icon: 'ant-design:aliwangwang-outlined',
      hideChildrenInMenu: true,
    },
    children: [studentDetail],
  };
  return [student, subject];
}

export function adminRoutes(): AppRouteModule[] {
  const admin = {
    path: '/admin',
    name: 'Admin',
    component: LAYOUT,
    redirect: { name: 'AdminIndex' },
    meta: {
      title: '管理员账号',
      orderNo: 100,
      icon: 'ant-design:aliwangwang-outlined',
      hideChildrenInMenu: true,
    },
    children: [
      msIndex,
      msDetail,
      studentDetail,
      {
        path: 'index',
        component: () => import('/@/views/admin/index.vue'),
        name: 'AdminIndex',
        meta: {
          icon: 'ant-design:aliwangwang-outlined',
          title: '管理员账号',
        },
      },
    ],
  };
  const ms: AppRouteRecordRaw = {
    name: 'msIndex',
    redirect: { name: msIndex.name },
    component: LAYOUT,
    path: '/ms',
    meta: {
      title: '体测信息',
      icon: 'ant-design:aliwangwang-outlined',
      hideChildrenInMenu: true,
      orderNo: 2,
    },
    children: [msIndex, msDetail],
  };
  const base: AppRouteRecordRaw = {
    path: '/base',
    name: 'base',
    component: LAYOUT,
    redirect: { name: collegeIndex.name },
    meta: {
      orderNo: 1,
      icon: 'ant-design:database-outlined',
      title: '基础数据管理',
    },
    children: [collegeIndex, collegeDetail, classIndex, classDetail],
  };
  return [admin, ms, base];
}
