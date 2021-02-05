import { request } from '@/utils/request'

/**
 * 增
 * @param {object} data 
 */
export function addSim(data) {
  console.log("========增========");
  console.log(data);
  return request({
    url: `/business-admin/sim/add`,
    method: 'post',
    data
  })
}

/**
 * 删
 * @param {Array} idArr 
 */
export function deleteSim(idArr) {
  console.log("========删========");
  console.log(idArr);
  return request({
    url: `/business-admin/sim/delete/${idArr}`,
    method: 'delete',
  })
}

/**
 * 导出
 * @param {object} data 
 */
export function exportData(data) {
  console.log("========导出========");
  console.log(data);
  return request({
    url: `business-admin/sim/exportSIMList`,
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 改
 * @param {object} data 
 */
export function modifySim(data) {
  console.log("========改========");
  console.log(data);
  return request({
    url: `/business-admin/sim/update`,
    method: 'post',
    data
  })
}
/**
 * 查
 * @param {object} data 
 */
export function searchSim(data) {
  console.log("========查========");
  console.log(data);
  return request({
    url: '/business-admin/sim/listAll',
    method: 'post',
    data
  })
}
