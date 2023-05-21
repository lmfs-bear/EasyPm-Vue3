import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询列表
export function listTeachingWork(query) {
    return request({
        url: '/performance/teachingWork/page',
        method: 'get',
        params: query
    })
}

// 查询年度考核明细
export function getResult( annual) {
    return request({
        url: '/performance/result/' + annual,
        method: 'get'
    })
}


