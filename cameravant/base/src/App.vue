<template>
    <div id="app">
      <router-view />
    </div>
  </template>
  <script>
    export default {
      created() {
        window.sessionStorage.setItem('appid', 'wxac2693b644b34e48');
       // window.sessionStorage.setItem('openid', 'ooiMn1pH2LsgHSeKcwRjprA9e300');
        // ooiMn1lFrWjvu6YCxM19eqRURv7k
      }
    }
  </script>
  <style lang="less">
@import "../public/public.less";
    @import "../public/iconfont/iconfont.css";
    body {
      font-size: 16px;
      background-color: #f8f8f8;
      -webkit-font-smoothing: antialiased;
    }
  
    .flex {
      display: -webkit-flex;
      /* Safari */
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      /* align-content: flex-start | flex-end | center | space-between | space-around | stretch;align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。 */
    }
  
    .clearfix:after {
      content: "";
      display: block;
      clear: both;
    }
  
    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  
  </style>