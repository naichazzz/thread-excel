import { request } from '@/utils/request'

// 上传设置信息
export function uploadInfo(data) {
    return request({
      url: 'business-admin/terminalSetting/setParam',
      method: 'post',
      data
    })
  }