import request from '@/utils/request'

export function getDictOptions() {
  return request({
    url: '/userservice/dict/getDictList',
    method: 'get'
  })
}

export function getDictList(data) {
  return request({
    url: '/userservice/dict/query/list',
    method: 'get',
    params: data
  })
}

export function updateDict(data) {
  return request({
    url: '/userservice/dict/update/update',
    method: 'post',
    data
  })
}

export function deleteDict(id) {
  return request({
    url: '/userservice/dict/update/delete/' + id,
    method: 'delete'
  })
}

export function deleteListDict(idList) {
  return request({
    url: '/userservice/dict/update/deleteList/' + idList,
    method: 'delete'
  })
}

export function getAccountListByDictId(dictId) {
  return request({
    url: '/userservice/dict/query/getAccountListBydictId?dictId=' + dictId,
    method: 'get'
  })
}

export function getSuperDictOptions() {
  return request({
    url: '/userservice/dict/query/getSelectList',
    method: 'get'
  })
}

export function relateUser(dictId, userList) {
  return request({
    url: '/userservice/dict/update/relateUser',
    method: 'post',
    params: { 'dictId': dictId, 'selectedUserList': userList.toString() }
  })
}
