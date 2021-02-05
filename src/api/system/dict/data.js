import {request} from '@/utils/request'

// 查询字典数据列表
export function listData(data) {
  return request({
    url: 'business-admin/dictData/listDictData',
    method: 'post',
    data
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: 'business-admin/dictData/detailDictData/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: 'business-admin/dictData/getDictDataByDictType/' + dictType,
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: 'business-admin/dictData/addDictData',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: 'business-admin/dictData/editDictData',
    method: 'post',
    data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: 'business-admin/dictData/deleteDictData/' + dictCode,
    method: 'delete'
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: 'http://59.110.236.250:9109/system/dict/data/export',
    method: 'get',
    params: query
  })
}
