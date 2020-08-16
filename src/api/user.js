import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'authenticate',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: 'userservice/userInfo/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
