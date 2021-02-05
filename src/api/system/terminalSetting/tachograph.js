import { request } from '@/utils/request'

export function collection(data) {
  return request({
    url: `business-admin/terminalSetting/collection`,
    method: 'post',
    data
  })
}

export function collectionResult(data) {
  return request({
    url: `business-admin/terminalSetting/collectionResult`,
    method: 'post',
    data
  })
}
