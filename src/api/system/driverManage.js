import { request } from '@/utils/request'

/**
 * 增加司机
 * @param {object} data
 */
export function addDriver(data) {
    return request({
        url: 'business-admin/driver/add',
        method: 'post',
        data
    })
}

/**
 * 删除司机
 * @param {Attr}} idList
 */
export function deleteDriver(idList) {
    return request({
        url: `business-admin/driver/delete/${idList}`,
        method: 'delete'
    })
}

/**
 * 修改司机
 * @param {object}} data
 */
export function modifyDriver(data) {

    return request({
        url: 'business-admin/driver/edit',
        method: 'post',
        data
    })
}

/**
 * 查询司机
 * @param {数据}} data
 */
export function searchDriver(data) {
    return request({
        url: `business-admin/driver/list`,
        method: 'get',
        params: data
    })
}


// 导出
export function exportData(data){
    return request({
      url: `business-admin/driver/exportDriverList`,
      method: 'get',
      params:data,
      responseType: 'arraybuffer'
    })
}
