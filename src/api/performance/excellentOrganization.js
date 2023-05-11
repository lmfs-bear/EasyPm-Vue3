import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询列表
export function listExcellentOrganization(query) {
    return request({
        url: '/performance/excellent_organization/page',
        method: 'get',
        params: query
    })
}

// 查询获优秀组织奖情况明细
export function getExcellentOrganization(id) {
    return request({
        url: '/performance/excellent_organization/' + parseStrEmpty(id),
        method: 'get'
    })
}

// 新增获优秀组织奖情况
export function addExcellentOrganization(data) {
    if (data.timeCompetition !== undefined) {
        const start = new Date(data.timeCompetition);
        start.setHours(0);
        data.timeCompetition = parseInt(start.getTime().toString());
    }
    return request({
        url: '/performance/excellent_organization',
        method: 'post',
        data: data
    })
}

// 删除获优秀组织奖情况
export function delExcellentOrganization(id) {
    return request({
        url: '/performance/excellent_organization/' + id,
        method: 'delete'
    })
}

//审核
export function examine(ids, status) {
    const data = {
        ids,
        status
    }
    return request({
        url: '/performance/excellent_organization/examine',
        method: 'post',
        data: data
    })
}

// 修改获优秀组织奖情况
export function updateExcellentOrganization(data) {
    return request({
        url: '/performance/excellent_organization',
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
        url: '/performance/excellent_organization/submit',
        method: 'post',
        data: data
    })
}
