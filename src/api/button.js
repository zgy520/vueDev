import request from '@/utils/request'

export function getButtonList(data) {
    return request({
        url: '/userservice/button/query/list',
        method: 'get',
        params: data
    })
  }
  
  export function updateButton(data) {
    return request({
        url: '/userservice/button/update/update',
        method: 'post',
        data
    })
  }
  
  export function deleteButton(id) {
    return request({
        url: '/userservice/button/update/delete/' + id,
        method: 'delete'
    })
  }
  
  export function deleteListButton(idList) {
    return request({
        url: '/userservice/button/update/deleteList/' + idList,
        method: 'delete'
    })
  }

  export function getButtonListByMenuId(menuId) {
    return request({
      url: '/userservice/menu/query/getButtonListByMenuId?menuId=' + menuId,
      method: 'get'
    })
  }
