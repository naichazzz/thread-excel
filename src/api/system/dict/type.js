import {request} from '@/utils/request'

// 查询字典类型列表
export function listType(data) {
  return request({
    url: 'business-admin/dict/listDict',
    method: 'post',
    data
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: 'business-admin/dict/detailDict/' + dictId,
    method: 'get'
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: 'business-admin/dict/addDict',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: 'business-admin/dict/editDict',
    method: 'post',
    data
  })
}

// 删除字典类型
export function delType(dictId) {
  return request({
    url: 'business-admin/dict/deleteDict/' + dictId,
    method: 'delete'
  })
}

// 清理参数缓存
export function clearCache() {
  return request({
    url: 'http://59.110.236.250:9109/system/dict/type/clearCache',
    method: 'delete'
  })
}

// 导出字典类型
export function exportType(query) {
  return request({
    url: 'http://59.110.236.250:9109/system/dict/type/export',
    method: 'get',
    params: query
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: 'business-admin/dict/optionSelect',
    method: 'get'
  })
}
