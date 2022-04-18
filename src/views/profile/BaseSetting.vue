<template>
  <!-- <a-row>
    <a-col :span="18">
      <BasicForm @register="register" />
    </a-col>
    <a-col :span="6">
      <div class="change-avatar">
        <div class="mb-2">头像</div>
        <CropperAvatar
          :uploadApi="uploadApi"
          :value="avatar"
          btnText="更换头像"
          :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
          @change="updateAvatar"
        />
      </div>
    </a-col>
  </a-row>
  <div class="my-4 flex justify-center">
    <a-button type="primary" @click="handleSubmit"> 更新基本信息 </a-button>
  </div> -->
  <div class="mx-6">
    <a-descriptions bordered title="个人详情" v-if="userInfo.userType === 'ADMIN'">
      <template #extra>
        <a-button class="mr-2" type="primary" @click="tryEditUser">修改个人信息</a-button>
        <a-button type="primary" @click="tryModifyPwd">修改密码</a-button>
      </template>
      <a-descriptions-item label="工号">{{ userInfo.userId }}</a-descriptions-item>
      <a-descriptions-item label="姓名">{{ userInfo.username }}</a-descriptions-item>
      <a-descriptions-item label="身份">教师</a-descriptions-item>
      <a-descriptions-item label="性别"><Icon icon="twemoji:female-sign" /></a-descriptions-item>
      <a-descriptions-item label="邮箱">{{ userInfo.email }}</a-descriptions-item>
      <a-descriptions-item label="手机">{{ userInfo.phone }}</a-descriptions-item>
      <a-descriptions-item v-if="userInfo.clgName" label="学院">{{
        userInfo.clgName
      }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ userInfo.createdTime }}</a-descriptions-item>
      <a-descriptions-item label="上次登录">{{ userInfo.lastLoginTime }}</a-descriptions-item>
      <a-descriptions-item label="上次修改" v-if="userInfo.lastModifyTime">{{
        userInfo.lastModifyTime
      }}</a-descriptions-item>
      <a-descriptions-item label="备注信息" />
      <a-descriptions-item label="备注信息">暂无信息</a-descriptions-item>
    </a-descriptions>
    <a-descriptions v-else bordered title="个人详情">
      <template #extra>
        <a-button type="primary" @click="tryEditUser">修改基本信息</a-button>
        <a-button type="primary" @click="tryModifyPwd">修改密码</a-button>
      </template>
      <a-descriptions-item label="学号">{{ userInfo.userId }}</a-descriptions-item>
      <a-descriptions-item label="姓名">{{ userInfo.username }}</a-descriptions-item>
      <a-descriptions-item label="身份">学生</a-descriptions-item>
      <a-descriptions-item label="性别"><Icon icon="twemoji:female-sign" /></a-descriptions-item>

      <a-descriptions-item v-if="userInfo.clgName" label="学院">{{
        userInfo.clgName
      }}</a-descriptions-item>
      <a-descriptions-item label="班级">{{ userInfo.clsName }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ userInfo.createdTime }}</a-descriptions-item>
      <a-descriptions-item label="上次登录">{{ userInfo.lastLoginTime }}</a-descriptions-item>
      <a-descriptions-item label="上次修改" v-if="userInfo.lastModifyTime">{{
        userInfo.lastModifyTime
      }}</a-descriptions-item>
      <a-descriptions-item label="备注信息">暂无信息</a-descriptions-item>
    </a-descriptions>
  </div>
  <EditModal @register="userModal" @submit="handleSubmit" />
  <ChangePwdModal @register="pwdModal" @submit="handleModifyPwd" />
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { Col, Descriptions, Row } from 'ant-design-vue';
  import Icon from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  import EditModal from './EditModal.vue';
  import { UserTypeEnum } from '/@/enums/userTypeEnum';
  import { StudentUpdateFormdata, updateStudent } from '/@/api/student';
  import { AdminUpdateFormdata, updateAdmin } from '/@/api/admin';
  import { useLoading } from '/@/components/Loading';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ChangePwdModal from './ChangePwdModal.vue';
  import { PwdModifyFormdata, updatePwd } from '/@/api/sys/user';

  export default defineComponent({
    components: {
      Icon,
      [Row.name]: Row,
      [Col.name]: Col,
      EditModal,
      ChangePwdModal,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
    },
    setup() {
      const [openFullLoading, closeFullLoading] = useLoading({ tip: '请稍后...' });
      const userStore = useUserStore();
      const { createMessage } = useMessage();
      const state = reactive({
        userInfo: userStore.getUserInfo,
      });
      computed(() => {
        const rs = [];
        state.userInfo.roles.forEach((r) => {});
        return rs;
      });

      const [userModal, { openModal: openUserModal }] = useModal();
      const [pwdModal, { openModal: openPwdModal }] = useModal();

      onMounted(async () => {
        const data = userStore.getUserInfo;
        console.log(userStore.getAuthorities);
        console.log(data);
        // setFieldsValue(data);
      });
      async function handleSubmit({ userId, userType, ...rest }) {
        if (rest.birth) {
          rest.birth = dateUtil(rest.birth).format('yyyy-MM-DD');
        }
        try {
          let success = false;
          openFullLoading();
          if (userType === UserTypeEnum.ADMIN) {
            rest.adminId = userId;
            success = await updateAdmin(rest as AdminUpdateFormdata);
          } else if (userType === UserTypeEnum.STUDENT) {
            rest.stuId = userId;
            success = await updateStudent(rest as StudentUpdateFormdata);
          }
          if (success) {
            Object.assign(state.userInfo, rest);
            createMessage.success('更新个人信息成功！');
          }
        } finally {
          closeFullLoading();
        }
      }

      async function handleModifyPwd(values: PwdModifyFormdata) {
        try {
          values.userId = state.userInfo.userId;
          values.userType = state.userInfo.userType;
          openFullLoading();
          const success = await updatePwd(values);
          if (success) {
            createMessage.success('操作成功！请重新登录！');
            userStore.logout();
          }
        } finally {
          closeFullLoading();
        }
      }

      function tryEditUser() {
        openUserModal(true, state.userInfo);
      }

      function tryModifyPwd() {
        openPwdModal(true);
      }

      return {
        ...toRefs(state),
        handleSubmit,
        userModal,
        tryEditUser,
        tryModifyPwd,
        pwdModal,
        handleModifyPwd,
      };
    },
  });
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      border-radius: 50%;
    }
  }
</style>
