import { request } from '@/utils/request'

/**
 * 车辆呼转
 * @param {object} data 
 */
export function setCallForwarding(data) {
    console.log("车辆呼转");
    console.log(data);

    return request({
        url: `/business-admin/downMsg/setParam`,
        method: 'post',
        data
    })

}
