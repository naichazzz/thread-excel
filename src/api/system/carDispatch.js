import { request } from '@/utils/request'

/**
 * 车辆调度请求
 * @param {object} data 
 */
export function sendDispatch(data) {
    console.log("车辆调度请求");
    console.log(data);

    return request({
        url: `business-admin/monitor/dispatch`,
        method: 'post',
        data
    })

}
