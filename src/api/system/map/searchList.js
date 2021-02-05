import { request } from '@/utils/request'

// 查询车辆信息
export function searchlist(data) {
  return request({
    url: 'business-admin/monitor/vehicleInfo',
    method: 'post',
    data
  })
}

// 查询车辆类型
export function carTypelist() {
  return request({
    url: 'business-admin/dictData/getDictDataByDictType/sys_car_type',
    method: 'get'
  })
}

//企业名称
export function carCompanylist(data) {
  return request({
    url: 'business-admin/group/list',
    method: 'post',
    data
  })
}