import { request } from '@/utils/request'
// 车辆管理列表
let baseUrl = "http://59.110.236.250:9109"
export function getList(data) {
  return request({
    url: `business-admin/vehicle/list`,
    method: 'get',
    params: data

  })
}

// 新建车辆管理
export function addList(data) {
  return request({
    url: `business-admin/vehicle/add`,
    method: 'post',
    data

  })
}

// 修改车辆管理
export function editList(data) {
  return request({
    url: `/business-admin/vehicle/update`,
    method: 'put',
    data

  })
}

// 删除车辆管理
export function deleteList(id) {
  return request({
    url: `/business-admin/vehicle/delete/${id}`,
    method: 'delete',
  })
}

// 字典项
export function getDicList(dictType) {
  return request({
    url: `/business-admin/dictData/getDictDataByDictType/${dictType}`,
    method: 'get',
  })
}

// 查看组内用户
export function vehicleOwnerList(data) {
  return request({
    url: `/business-admin/vehicle/vehicleOwnerList`,
    method: 'get',
    params: data
  })
}

// 车绑定组
export function setGroups(data) {
  return request({
    url: `business-admin/vehicle/setGroups`,
    method: 'post',
    data

  })
}

// 导出
export function exportData(data){
  return request({
    url: `business-admin/vehicle/export`,
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 导入
export function importData(data){
  return request({
    url: `business-admin/vehicle/importVehicle`,
    method: 'post',
    data
  })
}

// 导出模板
export function exportTemplate (){
  return request({
    url: `business-admin/vehicle/getImportTemplate`,
    method: 'get',
    responseType: 'arraybuffer'
  })
}

// 查询终端列表
export function getlist(data) {
  return request({
    url: `business-admin/terminal/listBySelfGroup`,
    method: 'get',
    params:data
  })
}