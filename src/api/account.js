import request from '@/utils/request'

export function getAccountList(data) {
  return request({
      url: '/userservice/account/query/list',
      method: 'get',
      params: data
  })
}

export function updateUser(data) {
  return request({
      url: '/userservice/account/update/update',
      method: 'post',
      data
  })
}

export function deleteUser(id) {
  return request({
      url: '/userservice/account/update/delete/' + id,
      method: 'delete'
  })
}

export function deleteListUser(idList){
  return request({
      url: '/userservice/account/update/deleteList/' + idList,
      method: 'delete'
  })
}

export function getSelectList(){
  return request({
    url: '/userservice/account/query/getSelectList',
    method: 'get'
  })
}