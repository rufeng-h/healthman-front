<template>
  <a-row>
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
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CropperAvatar } from '/@/components/Cropper';

  import { useMessage } from '/@/hooks/web/useMessage';

  import headerImg from '/@/assets/images/header.jpg';
  import { baseSetschemas } from './data';
  import { useUserStore } from '/@/store/modules/user';
  import { uploadApi } from '/@/api/sys/upload';
  import { Col, Row } from 'ant-design-vue';

  export default defineComponent({
    components: {
      [Row.name]: Row,
      [Col.name]: Col,
      BasicForm,
      CropperAvatar,
    },
    setup() {
      const { createMessage } = useMessage();
      const userStore = useUserStore();

      const [register, { setFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: baseSetschemas,
        showActionButtonGroup: false,
      });

      onMounted(async () => {
        const data = userStore.getUserInfo;
        console.log(data);
        setFieldsValue(data);
      });

      const avatar = computed(() => {
        const { avatar } = userStore.getUserInfo;
        return avatar || headerImg;
      });

      function updateAvatar(src: string) {
        const userinfo = userStore.getUserInfo;
        userinfo.avatar = src;
        userStore.setUserInfo(userinfo);
      }

      return {
        avatar,
        register,
        uploadApi: uploadApi as any,
        updateAvatar,
        handleSubmit: () => {
          createMessage.success('更新成功！');
        },
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
