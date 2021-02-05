import { request } from '@/utils/request'

// 查询组信息
export function grouplist(data) {
  return request({
    url: 'business-admin/group/list',
    method: 'post',
    data
  })
}

// export function grouplistInfo(data) {
//   return request({
//     url: `group/list`,
//     method: 'post',
//     data
//   })
// }

// 新增组信息
export function addGroupList(data) {
  return request({
    url: 'business-admin/group/add',
    method: 'post',
    data
  })
}

// 修改组信息
export function updateGroupList(data) {
  return request({
    url: `business-admin/group/update`,
    method: 'post',
    data
  })
}

// 删除组信息
export function deleteGroupList(groupIds) {
  return request({
    url: `business-admin/group/delete/${groupIds}`,
    method: 'post',
  })
}

export function getGroupAndvehInfo(data) {
  return request({
    url: `business-admin/vehicle/getGroupVehicleList`,
    method: 'get',
    params:data
  })
}

// 导出
export function exportData(data){
  return request({
    url: `business-admin/group/exportGroupList`,
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 查询组车辆
export function getCarList(data) {
  return request({
    url: `business-admin/vehicle/getVehicleListByGroupId`,
    method: 'get',
    params:data
  })
}

// 查询备选车辆信息
export function getCar(data) {
  return request({
    url: `business-admin/vehicle/getVehicleListNoBind`,
    method: 'get',
    params:data
  })
}