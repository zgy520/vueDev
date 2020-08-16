import request from '@/utils/request'

export function getMenuList(data) {
    return request({
        url: '/userservice/menu/query/list',
        method: 'get',
        params: data
    })
  }
  
  export function updateMenu(data) {
    return request({
        url: '/userservice/menu/update/update',
        method: 'post',
        data
    })
  }
  
  export function deleteMenu(id) {
    return request({
        url: '/userservice/menu/update/delete/' + id,
        method: 'delete'
    })
  }
  
  export function deleteListMenu(idList) {
    return request({
        url: '/userservice/menu/update/deleteList/' + idList,
        method: 'delete'
    })
  }

  export function getMenuOptions() {
    return request({
      url: '/userservice/menu/query/getSelectList',
      method: 'get'
    })
  }

  export function relateButton(menuId, buttonList){
    return request({
      url: '/userservice/menu/update/relateButton',
      method: 'post',
      params: {"menuId": menuId, "selectedButtonList": buttonList.toString()}
    })
  }
