import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listEducationThesis(query) {
    return request({
        url: '/performance/education_thesis/page',
        method: 'get',
        params: query
    })
}

// 查询教研论文明细
export function getEducationThesis(id) {
    return request({
        url: '/performance/education_thesis/' + parseStrEmpty(id),
        method: 'get'
    })
}

// 新增教研论文
export function addEducationThesis(data) {
    if (data.timePublish !== undefined) {
        const start = new Date(data.timePublish);
        start.setHours(0);
        data.timePublish = parseInt(start.getTime().toString());
    }
    return request({
        url: '/performance/education_thesis',
        method: 'post',
        data: data
    })
}

// 删除教研论文
export function delEducationThesis(id) {
    return request({
        url: '/performance/education_thesis/' + id,
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
        url: '/performance/education_thesis/examine',
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
  
// 修改教研论文
export function updateEducationThesis(data) {
    if (data.timePublish !== undefined) {
        const start = new Date(data.timePublish);
        start.setHours(0);
        data.timePublish = parseInt(start.getTime().toString());
    }
    return request({
        url: '/performance/education_thesis',
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
        url: '/performance/education_thesis/submit',
        method: 'post',
        data: data
    })
}
