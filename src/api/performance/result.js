import request from '@/utils/request'

// 查询列表
export function listAnnualResult(query) {
    return request({
        url: '/performance/result/page',
        method: 'get',
        params: query
    })
}

// 查询年度考核明细
export function getResult(annual) {
    return request({
        url: '/performance/result/' + annual,
        method: 'get'
    })
}

export function findAnnualResult(query) {
    return request({
        url: '/performance/result/getAggregation',
        method: 'get',
        params: query
    })
}

export function getHistory() {
    return request({
        url: '/performance/result/getHistory',
        method: 'get',
    })
}
