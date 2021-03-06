import axios from 'axios'
import router from '../router'
import store from '../store'
axios.defaults.withCredentials = true;
// 创建axios实例
const service = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});

// request拦截器
service.interceptors.request.use(config => {
  // if (store.state.common.token) config.headers.authorization = store.state.common.token;
  return config;
}, error => {
  return Promise.reject(error);
});
// response拦截器
service.interceptors.response.use(response => {
  //拦截session超时
  let isTimeout = (response && (response.data.code === '0202' || response.data.code === 1006 || response.data.code === 1007 || response.data.code === 1008 || response.data.code === 1013));
  if (isTimeout) {
    store.commit('common/setUser', '');
    router.replace({path: '/login'});
  }
  return response;
}, error => {
  return Promise.reject(error);
});

export default service;
