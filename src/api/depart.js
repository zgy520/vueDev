import request from '@/utils/request'

export function getDepartOptions() {
  return request({
    url: '/userservice/depart/getDepartList',
    method: 'get'
  })
}

export function getDepartList(data) {
  return request({
    url: '/userservice/depart/query/list',
    method: 'get',
    params: data
  })
}

export function updateDepart(data) {
  return request({
    url: '/userservice/depart/update/update',
    method: 'post',
    data
  })
}

export function deleteDepart(id) {
  return request({
    url: '/userservice/depart/update/delete/' + id,
    method: 'delete'
  })
}

export function deleteListDepart(idList) {
  return request({
    url: '/userservice/depart/update/deleteList/' + idList,
    method: 'delete'
  })
}

export function getAccountListByDepartId(departId) {
  return request({
    url: '/userservice/depart/query/getAccountListByDepartId?departId=' + departId,
    method: 'get'
  })
}

export function getPostListByDepartId(departId) {
  return request({
    url: '/userservice/depart/query/getPostListByDepartId?departId=' + departId,
    method: 'get'
  })
}

export function getSuperDepartOptions() {
  return request({
    url: '/userservice/depart/query/getSelectList',
    method: 'get'
  })
}

export function relateUser(departId, userList) {
  return request({
    url: '/userservice/depart/update/relateUser',
    method: 'post',
    params: { 'departId': departId, 'selectedUserList': userList.toString() }
  })
}

export function relatePost(departId, postList) {
  return request({
    url: '/userservice/depart/update/relatePost',
    method: 'post',
    params: { 'departId': departId, 'selectedPostList': postList.toString() }
  })
}
