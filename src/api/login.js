import { request } from '@/utils/request'
/**
 * 用户登录
 * @param username
 * @param password
 */
export const login = ({ username, password , code, uuid}) => {
  console.log(code)
  const data = {
    username,
    password,
    code,
    uuid
  }
  // 连接口
  return request({
    url: 'business-admin/system/login',
    data,
    method: 'post'
  })
  // 假数据
  // var res={
  //   "code":"200",
  //   "message":"操作成功",
  //   "data":{
  //     "token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNjA4NzAwNjIzLCJ1c2VyX25hbWUiOiJhZG1pbiIsImp0aSI6ImEzNjg0OWNjLTMwZTMtNDc0ZC05OGJhLWRlMzUyMTQ4MzMxYiIsImNsaWVudF9pZCI6ImFkbWluLWFwcCIsInNjb3BlIjpbImFsbCJdfQ.XX5WZLfgncHV1DiSFBiBfn5WEmJo8-_PI-gdXHBFpmWPTW0EcSjfVUvwBtCPi6UsI0I9PfU-crJec35m1UNYyknWvf09YPpazzLKvYGzKmnSuQHtub2_gL1GX3_IkGXXq5YzGzh67IiVF7Fz-1xQ-XJP0Yr8Xlt6Z5DsNKHzih8",
  //     "refreshToken":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLCJhdGkiOiJhMzY4NDljYy0zMGUzLTQ3NGQtOThiYS1kZTM1MjE0ODMzMWIiLCJpZCI6MSwiZXhwIjoxNjA4NzAwNjIzLCJqdGkiOiJmZThiODMyZC05NjY0LTRjNWMtYmI1OC05M2I1NTY0MTcwYTgiLCJjbGllbnRfaWQiOiJhZG1pbi1hcHAifQ.li2IpRmMnHvaj_GW89HaYNecgOBm2mrcbaHye0R4mGJ7befEEvU5PDHYFFtr-0nvHWkrCkAFxiR1cUCwCT6r_M3GsLka19fAGoAX5418UzrbfoSgO6JsZOxQA_GxgszgLpi4MrXZ-WblhqBOiIp7nqjbHX7M8j7BUxdebWv_Cp4",
  //   },

  //   "expiresIn":"2591999",
  //   "tokenHead":"Bearer "
  //  }
  //  return new Promise(function(resolve, reject){
  //    resolve(res);
  //  })
}

// 获取用户详细信息
export function getInfo() {
  // 真数据
  return request({
    url: 'business-admin/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: 'business-admin/system/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  // 连接口
  return request({
    url: 'business-admin/system/captchaImage',
    method: 'get'
  })
  // 假数据
  // var res={
  //     "code": 200,
  //     "message": "操作成功",
  //     "data": {
  //         "uuid": "d2d2ec63df464bddb5bfa4775ee28d84",
  //         "img": "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"
  //     },
  //     "success": true
  // }
  // return new Promise(function(resolve, reject){
  //   resolve(res);
  // })

}

// 修改密码
export function changePW(data) {
  return request({
    url: 'business-admin/system/updatePassword',
    method: 'post',
    data
  })
}
