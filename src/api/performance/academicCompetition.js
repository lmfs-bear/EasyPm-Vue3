import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询列表
export function listCompetition(query) {
    return request({
        url: '/performance/academic_competition/page',
        method: 'get',
        params: query
    })
}

// 查询竞赛获奖情况明细
export function getCompetition(id) {
    return request({
        url: '/performance/academic_competition/' + parseStrEmpty(id),
        method: 'get'
    })
}

// 新增竞赛获奖情况
export function addCompetition(data) {
    if (data.timePublish !== undefined) {
        const start = new Date(data.timePublish);
        start.setHours(0);
        data.timePublish = parseInt(start.getTime().toString());
    }
    return request({
        url: '/performance/academic_competition',
        method: 'post',
        data: data
    })
}

// 删除竞赛获奖情况
export function delCompetition(id) {
    return request({
        url: '/performance/academic_competition/' + id,
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
        url: '/performance/academic_competition/examine',
        method: 'post',
        data: data
    })
}

// 修改竞赛获奖情况
export function updateCompetition(data) {
    return request({
        url: '/performance/academic_competition',
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
        url: '/performance/academic_competition/submit',
        method: 'post',
        data: data
    })
}
