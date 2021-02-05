import { request } from '@/utils/request'

// 查询车辆信息
export function carlist(data) {
  return request({
    url: 'business-admin/monitor/realtimeInfo',
    method: 'post',
    data
  })
}

// 区域查车
export function arealist(data) {
  return request({
    url: 'business-admin/monitor/realtimeInfoByArea',
    method: 'post',
    data
  })
}

// 车辆点名
export function caller(data) {
  return request({
    url: 'business-admin/monitor/rollcall',
    method: 'post',
    data
  })
}

// 车辆跟踪
export function followed(data) {
  return request({
    url: 'business-admin/monitor/track',
    method: 'post',
    data
  })
}
