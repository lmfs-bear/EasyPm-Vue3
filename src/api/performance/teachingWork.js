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

// 查询教学工作量明细
export function getTeachingWork(id) {
  return request({
    url: '/performance/teachingWork/' + parseStrEmpty(id),
    method: 'get'
  })
}

// 新增教学工作量
export function addTeachingWork(data) {
  return request({
    url: '/performance/teachingWork',
    method: 'post',
    data: data
  })
}

// 删除教学工作量
export function delTeachingWork(id) {
  return request({
    url: '/performance/teachingWork/' + id,
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
    url: '/performance/teachingWork/examine',
    method: 'post',
    data: data
  })
}

// 修改教学工作量
export function updateTeachingWork(data) {
  return request({
    url: '/performance/teachingWork',
    method: 'put',
    data: data
  })
}

//提交审核
export function submit(ids) {
  const data = {
    ids
  }
  return request({
    url: '/performance/teachingWork/submit',
    method: 'post',
    data: data
  })
}
