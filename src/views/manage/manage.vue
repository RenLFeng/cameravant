<!-- 运维管理 父级页面 -->
<template>
  <div id="routerManage" class="router-manage">
    <div class="manage-left">
      <Menu class="manage-menu" :active-name="menuName" @on-select="pageToMenu">
        <MenuItem :name="item.name" v-for="(item, index) in menuList" :key="index">
        <Icon :type="item.icon"></Icon>
        {{ item.text }}
        </MenuItem>
      </Menu>
    </div>
    <router-view @set-manage-menu="getManageMenu"></router-view>
  </div>
</template>

<script>
  export default {
    name: "manageRouter",
    data() {
      return {
        menuName: "products",
        menuList: [
          // { name: "products", text: "产品库管理", icon: "ios-paper" },
          { name: "products", text: "产品库管理"},
          { name: "sales", text: "产品销售管理"},
          { name: "productFile", text: "产品档案管理" },
          { name: "msg", text: "APP消息推送" },
          { name: "appUser", text: "APP用户管理" },
          { name: "appMaintain", text: "APP维护" },
          { name: "troubleList", text: "产品反馈和售后" },
          { name: "appManage", text: "APP管理" },
        ]
      };
    },
    beforeCreate() {
      // 传值给父级main.vue（第二个导航）
      this.$emit("set-active-nav", "manage");
    },
    created() { },
    methods: {
      // 接收从子组件传来的当前选中菜单
      getManageMenu(name) {
        this.menuName = name;
      },
      // 菜单栏跳转
      pageToMenu(name) {
        this.$router.push("/manage/" + name);
      }
    }
  };
</script>
<style lang="less">
  /* 这里写整个运维管理的通用样式 */

  .router-manage {
    height: 100%;
    overflow: hidden;
    .manage-left {
      float: left;
      width: 200px;
      height: 100%;
      background-color: #fff;
      .manage-menu {
        width: 200px !important;
        height: 100%;
        padding: 3.5px 0;
        box-shadow: 0 0 1px #eaeaea;
      }
    }
    .manage-right {
      position: relative;
      margin-left: 200px;
      height: 100%;
      overflow: hidden;
      .top-bar {
        height: 56px;
        padding: 12px 20px;
        line-height: 32px;
        background-color: #fff;
        font-size: 16px;
        color: #17233D;
      }
      .manage-content {
        position: absolute;
        top: 56px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 20px;
        overflow: auto;
        .content {
          box-shadow: 0 0 5px #ccc;
          background-color: #fff;
        }
      }
    }
  }
</style>