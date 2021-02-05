import { request } from '@/utils/request'
// 查询终端列表
export function getlist(data) {
  return request({
    url: `business-admin/terminal/list`,
    method: 'get',
    params:data
  })
}

// 新建终端信息
export function addlist(data) {
  return request({
    url: 'business-admin/terminal/add',
    method: 'post',
    data
  })
}

// 删除终端
export function deletelist(data) {
  return request({
    url: 'business-admin/terminal/delete/'+data,
    method: 'delete',

  })
}

// 修改终端
export function modifylist(data) {
  return request({
    url: 'business-admin/terminal/update',
    method: 'put',
    data
  })
}

// 导出用户
export function exportUser(data) {
  return request({
    url: 'business-admin/terminal/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
