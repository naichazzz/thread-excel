import { request } from '@/utils/request'

// 列表
export function roleList(data) {
  return request({
    url: `business-admin/role/list`,
    method: 'post',
    data
  })
}
// 删除角色
export function deleteInfo(id) {
  return request({
    url: `business-admin/role/delete/${id}`,
    method: 'post',
  })
}

// 功能菜单
export function menuList(data) {
  return request({
    url: `business-admin/menu/list`,
    method: 'post',
    data
  })
}

export function exportData(data) {
  return request({
    url: `business-admin/role/export`,
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 添加角色
export function addInfo(data) {
  return request({
    url: 'business-admin/role/add',
    method: 'post',
    data
  })

}
// 修改角色
export function updateInfo(id,data) {
  return request({
    url: `business-admin/role/update/${id}`,
    method: 'post',
    data
  })

}



