import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询列表
export function listPatents(query) {
    return request({
        url: '/performance/patents/page',
        method: 'get',
        params: query
    })
}

// 查询专利（著作权）授权情况明细
export function getPatents(id) {
    return request({
        url: '/performance/patents/' + parseStrEmpty(id),
        method: 'get'
    })
}

// 新增专利（著作权）授权情况
export function addPatents(data) {
    if (data.timeApproval !== undefined) {
        const start = new Date(data.timeApproval);
        start.setHours(0);
        data.timeApproval = parseInt(start.getTime().toString());
    }
    return request({
        url: '/performance/patents',
        method: 'post',
        data: data
    })
}

// 删除专利（著作权）授权情况
export function delPatents(id) {
    return request({
        url: '/performance/patents/' + id,
        method: 'delete'
    })
}

//审核
export function examine(ids, status, reason) {
    const data = {
        ids,
        status,
        reason,
    }
    return request({
        url: '/performance/patents/examine',
        method: 'post',
        data: data
    })
}
export function getLog(id) {
    return request({
        url: '/performance/examineLog/' + parseStrEmpty(id),
        method: 'get'
    })
}

// 修改专利（著作权）授权情况
export function updatePatents(data) {
    if (data.timeApproval !== undefined) {
        const start = new Date(data.timeApproval);
        start.setHours(0);
        data.timeApproval = parseInt(start.getTime().toString());
    }
    return request({
        url: '/performance/patents',
        method: 'put',
        data: data
    })
}

//审核
export function submit(ids) {
    const data = {
        ids
    }
    return request({
        url: '/performance/patents/submit',
        method: 'post',
        data: data
    })
}

export function getStudents() {
    return request({
        url: '/student',
        method: 'get'
    })
}