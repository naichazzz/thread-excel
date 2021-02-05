import { request } from '@/utils/request'

// 取列表
export function getList(data) {
    return request({
        url: `business-admin/electricFence/list`,
        method: 'get',
        params: data
    })
}

// 设置围栏车辆
export function setCars(data) {
    return request({
        url: 'business-admin/electricFence/setVehicles',
        method: 'post',
        data
    })
}

//新增电子围栏
export function newFence(data) {
    return request({
        url: 'business-admin/electricFence/add',
        method: 'post',
        data
    })
}
// 根据id获取围栏详情
export function fenceDetail(id) {
    return request({
        url: `business-admin/electricFence/getInfo/`+id,
        method: 'get'
    })
}

// 删除
export function deleteItem(data) {
    return request({
        url: `business-admin/electricFence/delete`,
        method: 'post',
        data
    })
}

// 导出
export function exportData(data) {
    return request({
        url: `business-admin/electricFence/export`,
        method: 'post',
        data,
        responseType: 'arraybuffer'
    })
}