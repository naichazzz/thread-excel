import { request } from '@/utils/request'

// 获取列表
export function listInfo(data) {
  return request({
    url: 'business-admin/monitor/trackHistory',
    method: 'post',
    data
  })
}

// 获取经纬度
export function getLaLInfo() {
  return request({
    url: './static/mapMock.json',
    method: 'gwt',
  })
}

// 导出
export function exportData(data) {
  return request({
    url: `business-admin/role/export`,
    method: 'post',
    data
  })
}