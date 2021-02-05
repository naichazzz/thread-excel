import { request } from '@/utils/request'
// 终端类型列表
export function getList(data) {
  return request({
    url: `business-admin/terminalType/list`,
    method: 'get',
    params: data

  })
}
// 终端类型列表
export function getTerminalList(data) {
  return request({
    url: `business-admin/terminalType/list`,
    method: 'get',
    params: data

  })
}
// 新建终端类型
export function addList(data) {
  return request({
    url: `business-admin/terminalType/add`,
    method: 'post',
    data

  })
}

// 修改终端类型
export function editList(data) {
  return request({
    url: `/business-admin/terminalType/update`,
    method: 'put',
    data

  })
}

// 删除终端类型
export function deleteList(id) {
  return request({
    url: `/business-admin/terminalType/delete/${id}`,
    method: 'delete',
  })
}

// 导出
export function exportData(data){
  return request({
    url: `business-admin/terminalType/export`,
    method: 'get',
    params:data,
    responseType: 'arraybuffer'
  })
}