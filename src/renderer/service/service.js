/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2022-01-19 18:09:14
 * @Description:
 * @FilePath: /CasaOS-UI/src/service/service.js
 */
import axios from 'axios'
import qs from 'qs'
import store from '@/store'
// Set Post Headers
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.withCredentials = false
axios.defaults.baseURL = `http://localhost:${process.env.SERVER_PORT}/v1`

// Create a axios instance, And set timeout to 30s
const instance = axios.create({
  timeout: 60000
})

const getInitLang = () => {
  let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en_us'
  return lang
}

// 请求和响应拦截可以根据实际项目需求进行编写
// 请求发起前拦截
instance.interceptors.request.use((config) => {
  let token = store.state.Casa.token
  config.headers.Authorization = token
  config.headers.common['Language'] = getInitLang()
  // console.log("请求拦截", config);
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截（请求返回后拦截）
instance.interceptors.response.use(response => {
  // console.log("响应拦截", response);
  return response
}, error => {
  console.log('catch', error)
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // localStorage.removeItem('user_token') // 可能是token过期，清除它
        // router.replace({ // 跳转到登录页面
        //   path: '/login',
        //   query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        // })
        store.commit('setServiceError', true)
        break
      case 404:
        store.commit('setServiceError', true)
        break
      case 500:
        break
    }
  } else {
    store.commit('setServiceError', true)
  }
  return Promise.reject(error)
})

const CancelToken = axios.CancelToken
// 按照请求类型对axios进行封装
const api = {

  get (url, data, _this) {
    if (_this) {
      return instance.get(url, {
        params: data,
        cancelToken: new CancelToken(function executor (c) {
          _this.cancelRequest = c
        })
      })
    } else {
      return instance.get(url, {
        params: data
      })
    }
  },
  post (url, data) {
    let newData = (url.indexOf('install') > 0 || url.indexOf('sys') > 0) ? JSON.stringify(data) : qs.stringify(data)
    if (url.indexOf('install') > 0) {
      axios.defaults.headers.post['Content-Type'] = 'application/json'
    } else {
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    return instance.post(url, newData)
  },
  put (url, data) {
    let newData = (url.indexOf('setting') > 0) ? JSON.stringify(data) : qs.stringify(data)
    if (url.indexOf('setting') > 0) {
      axios.defaults.headers.post['Content-Type'] = 'application/json'
    } else {
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    return instance.put(url, newData)
  },
  delete (url, data) {
    return instance.delete(url, { params: data })
  }
}
export { api }
