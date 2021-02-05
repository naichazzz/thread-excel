import { request } from '@/utils/request'

// 设置终端参数
export function setTerminalParam(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/setTerminalParam`,
        method: 'post',
        data
    })
}

// 日志查询列表
export function getTerminalMessageList(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/getTerminalMessageList`,
        method: 'get',
        params: data
    })
}

// 终端控制
export function terminalControl(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/terminalControl`,
        method: 'post',
        data

    })
}

// 下发终端升级包
export function sendTerminalUpgradePackage(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/sendTerminalUpgradePackage `,
        method: 'post',
        data

    })
}

// 电话回拨
export function callBack(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/callBack `,
        method: 'post',
        data

    })
}

// 设置电话本
export function setPhoneBook(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/setPhoneBook `,
        method: 'post',
        data

    })
}


// 文本信息下发
export function sendText(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/sendText  `,
        method: 'post',
        data

    })
}

// 上报驾驶员身份信息
export function inquireDriverInfo(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/inquireDriverInfo  `,
        method: 'post',
        data

    })
}

// 车辆控制
export function vehicleControl(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/vehicleControl  `,
        method: 'post',
        data

    })
}

// 行驶记录仪参数设置
export function rivingRecoderParametersDownload(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/drivingRecoderParametersDownload  `,
        method: 'post',
        data

    })
}

// 行驶记录仪采集
export function drivingRecorderDataCollection(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/drivingRecorderDataCollection `,
        method: 'post',
        data

    })
}

// 查询位置信息
export function locationInformationQuery(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/locationInformationQuery`,
        method: 'post',
        data

    })
}

// 临时位置跟踪
export function temporaryPositionTrackingControl(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/temporaryPositionTrackingControl`,
        method: 'post',
        data

    })
}

// 链路检测
export function linkDetectionRequestToTerminal(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/linkDetectionRequestToTerminal`,
        method: 'post',
        data

    })
}

// 数据下行透传
export function dataDownlinkTransmission(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/dataDownlinkTransmission`,
        method: 'post',
        data

    })
}

// 人工确认报警
export function manualConfirmationAlarm(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/manualConfirmationAlarm`,
        method: 'post',
        data
    })
}

//摄像头立即拍摄
export function cameraShootsImmediately(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/cameraShootsImmediately `,
        method: 'post',
        data
    })
}

//存储多媒体检索
export function storedMultimediaDataRetrieval(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/storedMultimediaDataRetrieval `,
        method: 'post',
        data
    })
}

// 存储多媒体数据上传
export function storeMultimediaDataUpload(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/storeMultimediaDataUpload  `,
        method: 'post',
        data
    })
}

// 录音开始
export function recordingStart(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/recordingStart   `,
        method: 'post',
        data
    })
}

// 单挑存储多媒体
export function oneStoredMultimediaDataUpload(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/oneStoredMultimediaDataUpload   `,
        method: 'post',
        data
    })
}

// 设置圆形区域
export function setCircleArea(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/setCircleArea`,
        method: 'post',
        data
    })
}

// 设置矩形区域
export function setRectangleArea(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/setRectangleArea`,
        method: 'post',
        data
    })
}

// 设置多边形区域
export function setPolygonArea(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/setPolygonArea`,
        method: 'post',
        data
    })
}

// 查询区域/路段
export function queryAreaOrLineData(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/queryAreaOrLineData`,
        method: 'post',
        data
    })
}

// 删除圆形区域
export function deleteCircleArea(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/deleteCircleArea`,
        method: 'post',
        data
    })
}

// 删除矩形区域
export function deleteRectangleArea(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/deleteRectangleArea`,
        method: 'post',
        data
    })
}

// 删除多边形区域
export function deletePolygonArea(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/deletePolygonArea`,
        method: 'post',
        data
    })
}

// 删除路段
export function deleteRoute(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/deleteRoute`,
        method: 'post',
        data
    })
}

// 设置路段
export function setRoute(data) {
    return request({
        url: `iov-device-debug-service/deviceDebug808v2019/setRoute`,
        method: 'post',
        data
    })
}