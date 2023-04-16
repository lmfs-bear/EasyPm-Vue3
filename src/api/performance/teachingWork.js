import request from '@/utils/request'

// 查询用户列表
export function listTeachingWork(query) {
  return request({
    url: '/performance/teachingWork/page',
    method: 'get',
    params: query
  })
}

// // 查询用户详细
// export function getUser(userId) {
//   return request({
//     url: '/system/user/' + parseStrEmpty(userId),
//     method: 'get'
//   })
// }

