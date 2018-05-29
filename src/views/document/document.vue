<!-- 产品文档 父级页面 -->
<template>
  <div id="routerDocument" class="router-document">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "documentRouter",
  data() {
    return {};
  },
  beforeCreate() {
    // 传值给父级main.vue（第四个导航）
    this.$emit("set-active-nav", "document");
  },
  created() {},
  methods: {}
};
</script>
<style>
</style>
