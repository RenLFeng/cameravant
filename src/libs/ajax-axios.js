/* axios简单做下处理 */
import axios from 'axios';
import qs from 'qs';

// 设置初始参数 ****************
const http = axios.create({
  baseURL: 'http://218.17.107.163:9400',  // 这里是放接口的统一前缀
  timeout: 10000 // 请求多少秒后还请求不到的话，就放弃
});

// 请求时拦截 ******************
http.interceptors.request.use(config => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);  // axios的特点就是遇到post方法时，数据要做一下stringify处理
  };
  return config;
}, error => Promise.reject(error));

// 响应时拦截 *****************
http.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.reject(error);
});


// 返回模块 *****************
export default http;
