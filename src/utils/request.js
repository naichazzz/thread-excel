import Vue from 'vue'
import axios from 'axios'
import context from '../main.js'
import { getToken } from '@/utils/auth'
import store from '@/store'
// import qs from 'qs'
// import store from '@/store'
import { Message } from 'element-ui'
import qs from 'qs'

import config from '../../config'
// const baseUrl = process.env.NODE_ENV === 'development' ? '/api' : '/'
const baseUrl=process.env.API_ROOT
// 创建 axios 实例
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const service = axios.create({
  // baseURL: baseUrl, // api base_url
  baseURL: baseUrl ,
  timeout: 30000 ,// 请求超时时间
  // headers: {
  // 	'Content-Type': 'application/json',
  // 	'Cache-Control': 'no-cache',
  // 	'Accept-Language': 'zh-CN,zh,zh-Hans;q=0.8,en-US;q=0.3,en;q=0.2'
  // }
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 401) {
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    } else if (error.response.status === 403) {
      Message.error({
        content: data.path + ',' + data.message
      })
    } else if (error.response.status === 502) {
      Message.error({
        content: '连接服务器失败!'
      })
    } else if (error.response.status === 429) {
      Message.error({
        content: '访问太过频繁，请稍后再试!'
      })
    } else {
      Message.error({
        content: error.response.data.message+'超时'
      })
    }
  } else {
    Message.error({
      content: '连接服务器失败!'
    })
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  // 参数签名处理
  // config = sign(config, Config.appId, Config.appSecretKey, 'SHA256')

  // config.method === 'get'
  //   ? config.params = { ...config.params } : config.data = qs.stringify({ ...config.data })
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }
  return config
},error => {
    console.log(error)
    Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.code === 0 || response.status === 200) {
    // 服务端定义的响应code码为0时请求成功
    // 使用Promise.resolve 正常响应
    return Promise.resolve(response.data)
  } else {
    // 使用Promise.reject 响应
    Message.error({
      content: response.data.message
    })

    return Promise.reject(response.data)
  }
}, err)

export {
  service as request
}
