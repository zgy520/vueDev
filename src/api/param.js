import request from '@/utils/request'

export function getParamList(data) {
    return request({
        url: '/userservice/param/query/list',
        method: 'get',
        params: data
    })
  }
  
  export function updateParam(data) {
    return request({
        url: '/userservice/paramInfo/update/update',
        method: 'post',
        data
    })
  }
  
  export function deleteParam(id) {
    return request({
        url: '/userservice/paramInfo/update/delete/' + id,
        method: 'delete'
    })
  }
  
  export function deleteListParam(idList) {
    return request({
        url: '/userservice/paramInfo/update/deleteList/' + idList,
        method: 'delete'
    })
  }
