import Vue from 'vue';
import App from './App';
import { router } from './router';
import ajaxApi from './libs/ajax-api'; // 加载接口api，方便统一管理
import ajaxAxios from './libs/ajax-axios'; // 简单封装下axios（其实不封装也可以的）
import axios from 'axios'; // 初始axios
import { Lazyload } from 'vant';
import methods from './libs/methods';
import vueTouch from './libs/vue-touch';
import Calendar from 'vue-mobile-calendar'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
// import echarts from "echarts";
// Vue.prototype.$echarts = echarts;
Vue.prototype.api = ajaxApi; // 把ajaxApi这个模块绑在Vue的原型上，然后全局环境里 this.api 就能拿到里面的数据了
Vue.prototype.axios = ajaxAxios; // 同理，挂载vue原型上
Vue.prototype.$axios = axios; // 挂载初始axios，以备复杂的请求用这个
// options 为可选参数，无则不传
Vue.use(Lazyload);
Vue.use(methods);
Vue.use(vueTouch);
Vue.use(Calendar);
Vue.use(Mint);
import 'amfe-flexible';
new Vue({
  router,
  el: '#app',
  render: h => h(App)
});
