<!-- 产品分析 父级页面 -->
<template>
  <div id="routerAnalyse" class="router-analyse">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "analyseRouter",
  data() {
    return {};
  },
  beforeCreate() {
    // 传值给父级main.vue（第三个导航）
    this.$emit("set-active-nav", "analyse");
  },
  created() {},
  methods: {}
};
</script>
<style>
</style>
