import request from '@/utils/request'

export function getEnterpriseOptions() {
    return request({
        url: '/userservice/enterprise/query/getSelectList',
        method: 'get'
    })
}
export function getEnterpriseList(data) {
    return request({
        url: '/userservice/enterprise/query/list',
        method: 'get',
        params: data
    })
}

export function updateEnterprise(data) {
    return request({
        url: '/userservice/enterprise/update/update',
        method: 'post',
        data
    })
  }
  
  export function deleteEnterprise(id) {
    return request({
        url: '/userservice/enterprise/update/delete/' + id,
        method: 'delete'
    })
  }
  
  export function deleteListEnterprise(idList) {
    return request({
        url: '/userservice/enterprise/update/deleteList/' + idList,
        method: 'delete'
    })
  }

  export function getSuperEnterpriseOptions() {
    return request({
      url: '/userservice/enterprise/query/getSelectList',
      method: 'get'
    })
  }