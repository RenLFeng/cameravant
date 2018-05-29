<template>
    <div id="appMain" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  data() {
    return {
      theme: this.$store.state.app.themeColor
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>

<style lang="less">
@import "styles/common.less";
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  overflow: hidden;
}
.app-main {
  width: 100%;
  height: 100%;
}
.avator-img {
  display: block;
  width: 80%;
  max-width: 100px;
  height: auto;
}
</style>
