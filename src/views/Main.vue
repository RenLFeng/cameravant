<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="top-header">
      <Menu mode="horizontal" :active-name="activeNav" @on-select="pageToNav">
        <Row>
          <Col span="4">
          <div class="layout-logo"><img src="../images/logo.png" alt=""></div>
          </Col>
          <Col span="16" style="text-align:center;">
          <ul class="layout-nav">
            <MenuItem :name="item.name" v-for="(item, index) in navList" :key="index">{{ item.text }}</MenuItem>
          </ul>
          </Col>
          <Col span="4" style="text-align:right;">
          <div class="header-avator-con">
            <div class="search">
              <Icon type="search" :size="20" style="margin-right:10px;color:#fff;vertical-align:middle;"></Icon>
              </Button>
            </div>
            <message-tip v-model="mesCount"></message-tip>
            <div class="user-dropdown-menu-con">
              <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                <Avatar :src="avatorPath" style="background: #619fe7;margin-right: 10px;"></Avatar>
                <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                  <a href="javascript:void(0)">
                    <Icon type="chevron-down" :size="14"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Row>
            </div>
          </div>
          </Col>
        </Row>
      </Menu>
    </div>
    <div class="mid-content">
      <keep-alive include="old_home">
        <router-view @set-active-nav="getActiveNav"></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "./main-components/tags-page-opened.vue";
import fullScreen from "./main-components/fullscreen.vue";
import lockScreen from "./main-components/lockscreen/lockscreen.vue";
import messageTip from "./main-components/message-tip.vue";
import themeSwitch from "./main-components/theme-switch/theme-switch.vue";
import Cookies from "js-cookie";
import util from "@/libs/util.js";
import scrollBar from "@/views/my-components/scroll-bar/vue-scroller-bars";

export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    fullScreen,
    lockScreen,
    messageTip,
    themeSwitch,
    scrollBar
  },
  data() {
    return {
      activeNav: "home",
      navList: [
        {
          name: "home",
          text: "产品创建"
        },
        {
          name: "manage",
          text: "运维管理"
        },
        {
          name: "analyse",
          text: "运营分析"
        },
        {
          name: "document",
          text: "开发文档"
        }
      ],
      sidebarPage: false,
      tagsShow: false,
      shrink: true,
      userName: "",
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr
    };
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },

    avatorPath() {
      return localStorage.avatorImgPath;
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    }
  },
  methods: {
    // 接收从子组件传来的当前选中导航
    getActiveNav(num) {
      this.activeNav = num;
    },
    // 导航跳转
    pageToNav(name) {
      this.$router.push("/" + name);
    },
    init() {
      let pathArr = util.setCurrentPath(this, this.$route.name);
      this.$store.commit("updateMenulist");
      if (pathArr.length >= 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.userName = Cookies.get("user");
      let messageCount = 3;
      this.messageCount = messageCount.toString();
      this.checkTag(this.$route.name);
      this.$store.commit("setMessageCount", 3);
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleClickUserDropdown(name) {
      if (name === "ownSpace") {
        util.openNewPage(this, "ownspace_index");
        this.$router.push({
          name: "ownspace_index"
        });
      } else if (name === "loginout") {
        // 退出登录
        this.$store.commit("logout", this);
        this.$store.commit("clearOpenedSubmenu");
        this.$router.push({
          name: "login"
        });
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      // if (name === 'accesstest_index') {
      //     return false;
      // } else {
      //     return true;
      // }
      return true;
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    },
    scrollBarResize() {
      if (this.sidebarPage) {
        this.$refs.scrollBar.resize();
      }
    }
  },
  watch: {
    $route(to) {
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },
    lang() {
      util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    } /*,
            openedSubmenuArr () {
                setTimeout(() => {
                    this.scrollBarResize();
                }, 300);
            }*/
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.scrollBarResize);
  },
  created() {
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
  },
  dispatch() {
    window.removeEventListener("resize", this.scrollBarResize);
  }
};
</script>
<style lang="less">
@import "../styles/main-common.less";
</style>
<style lang="less" scoped>
.ivu-menu-light {
  height: 64px;
  background: linear-gradient(to bottom, #2945cb, #2c83f9);
}
.layout-logo {
  width: 304px;
  height: 66px;
  float: left;
  position: relative;
  top: 10px;
  left: 16px;
  img {
    width: 155px;
    height: 40px;
  }
}
.layout-nav {
  text-align: center;
}
.ivu-menu-horizontal {
  .ivu-menu-item,
  .ivu-menu-submenu {
    float: none;
    display: inline-block;
  }
}
.ivu-menu-light.ivu-menu-horizontal {
  .ivu-menu-item,
  .ivu-menu-submenu {
    color: rgba(255, 255, 255, 0.8);
  }
  .ivu-menu-item-active,
  .ivu-menu-item:hover,
  .ivu-menu-submenu-active,
  .ivu-menu-submenu:hover {
    color: #fff;
  }
}
.top-header .header-avator-con .message-con {
  display: inline-block;
  width: 30px;
  margin-right: 90px;
  text-align: center;
  cursor: pointer;
}
.top-header .header-avator-con .message-con i {
  vertical-align: middle;
}
.top-header .header-avator-con .user-dropdown-menu-con {
  position: absolute;
  right: 14px;
  top: 0;
  width: 150px;
  height: 100%;
}
.top-header .header-avator-con .user-dropdown-menu-con .main-user-name {
  display: inline-block;
  width: 80px;
  word-break: keep-all;
  white-space: nowrap;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}
.top-header .search {
  display: inline-block;
}
.top-header .ivu-btn-primary {
  background: transparent;
  border: none;
}
.main-search {
  padding-top: 14px;
  .ivu-input-icon-normal + .ivu-input {
    padding-right: 7px;
    padding-left: 32px;
  }
  .ivu-input-icon {
    right: initial;
    left: 0;
  }
}
.modal {
  .label {
    line-height: 34px;
    font-size: 14px;
    color: rgba(29, 36, 54, 0.8);
    font-weight: bold;
    text-align: center;
  }
  .check_a {
    display: inline-block;
    height: 34px;
    line-height: 34px;
    padding: 0 5px;
    border-radius: 3px;
    border: 1px solid #dddee1;
    margin-right: 6px;
    margin-bottom: 5px;
    font-size: 14px;
    text-align: center;
    color: rgba(23, 35, 61, 0.8);
    vertical-align: middle;
    cursor: pointer;
    &.checked {
      border-color: #008cf8;
      color: #008cf8;
    }
    &_icon {
      padding-right: 6px;
      font-size: 20px;
    }
  }
}
</style>