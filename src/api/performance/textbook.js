import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询教材出版统计
export function listTextbook(query) {
  return request({
    url: '/performance/textbook/page',
    method: 'get',
    params: query
  })
}

// 查询教材出版统计
export function getTextbook(id) {
  return request({
    url: '/performance/textbook/' + parseStrEmpty(id),
    method: 'get'
  })
}

// 新增教材出版
export function addTextbook(data) {
  if (data.timeBeRewarded !== undefined) {
    const start = new Date(data.timeBeRewarded);
    start.setHours(0);
    data.timeBeRewarded = parseInt(start.getTime().toString());
  }
  if (data.timePublish !== undefined) {
    const start = new Date(data.timePublish);
    start.setHours(0);
    data.timePublish = parseInt(start.getTime().toString());
  }
  return request({
    url: '/performance/textbook',
    method: 'post',
    data: data
  })
}

// 删除教材出版
export function delTextbook(id) {
  return request({
    url: '/performance/textbook/' + id,
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
    url: '/performance/textbook/examine',
    method: 'post',
    data: data
  })
}

// 修改教材出版
export function updateTextbook(data) {
  if (data.timeBeRewarded !== undefined) {
    const start = new Date(data.timeBeRewarded);
    start.setHours(0);
    data.timeBeRewarded = parseInt(start.getTime().toString());
  }
  if (data.timePublish !== undefined) {
    const start = new Date(data.timePublish);
    start.setHours(0);
    data.timePublish = parseInt(start.getTime().toString());
  }
  return request({
    url: '/performance/textbook',
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
    url: '/performance/textbook/submit',
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
