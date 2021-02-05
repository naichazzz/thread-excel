import { request } from '@/utils/request'

// 查询用户列表
export function listUser(data) {
  return request({
    url: 'business-admin/user/list',
    method: 'post',
    data
  })
}

// 新增用户
export function newUser(data) {
  return request({
    url: 'business-admin/user/add',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(data,id){
  return request({
    url: 'business-admin/user/update/'+id,
    method: 'post',
    data
  })
  // 假数据
  // var res={
  //   "code": "200",
  //   "message":"操作成功"
  //   }
  // return new Promise(function(resolve, reject){
  //   resolve(res);
  // })
}
// 删除用户
export function deleteUser(data){
  return request({
    url: 'business-admin/user/delete/'+data.userids,
    method: 'post',
  })
}
// 查看车辆信息
export function getUserCar(data){
  return request({
    url: `business-admin/user/viewPermissionVehicle`,
    method: 'post',
    data
  })
}

// 导出
export function exportData(data){
  return request({
    url: 'business-admin/user/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 为用户重置密码
export function resetPsw(id){
  return request({
    url: 'business-admin/user/resetPassword/'+id,
    method: 'get'
  })
}

// 导出车辆列表
export function exportCarData(data){
  return request({
    url: 'business-admin/user/exportPermissionVehicle',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}