import { request } from '@/utils/request'

/**
 * 车速设置
 * @param {object} data 
 */
export function setMaxSpeed(data) {
    console.log("车速设置");
    console.log(data);

    return request({
        url: `/business-admin/downMsg/setParam`,
        method: 'post',
        data
    })

}
