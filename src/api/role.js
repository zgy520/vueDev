import request from '@/utils/request'

export function getRoleOptions() {
    return request({
        url: '/userservice/role/getRoleList',
        method: 'get'
    })    
}

export function getRoleList(data) {
    return request({
        url: '/userservice/role/query/list',
        method: 'get',
        params: data
    })
  }
  
  export function updateRole(data) {
    return request({
        url: '/userservice/role/update/update',
        method: 'post',
        data
    })
  }
  
  export function deleteRole(id) {
    return request({
        url: '/userservice/role/update/delete/' + id,
        method: 'delete'
    })
  }
  
  export function deleteListRole(idList) {
    return request({
        url: '/userservice/role/update/deleteList/' + idList,
        method: 'delete'
    })
  }

  export function getAccountListByRoleId(roleId) {
    return request({
      url: '/userservice/role/query/getAccountListByRoleId?roleId=' + roleId,
      method: 'get'
    })
  }

  export function relateUser(roleId, userList){
    return request({
      url: '/userservice/role/update/relateUser',
      method: 'post',
      params: {"roleId": roleId, "selectedUserList": userList.toString()}
    })
  }