import { request } from '@/utils/request'
// 查询菜单信息
export function menulist(data) {
  return request({
    url: 'business-admin/menu/list',
    method: 'post',
    data
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: 'business-admin/menu/add',
    method: 'post',
    data
  })
}

// 删除菜单
export function deleteMenu(data) {
  return request({
    url: 'business-admin/menu/delete/'+data,
    method: 'post'
  })
}

// 修改菜单
export function updateMenu(data,id) {
  return request({
    url: 'business-admin/menu/update/'+id,
    method: 'post',
    data
  })
}
