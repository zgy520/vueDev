import request from '@/utils/request'

export function getIndustryList(data) {
    return request({
        url: '/userservice/industry/query/list',
        method: 'get',
        params: data
    })
  }
  
  export function updateIndustry(data) {
    return request({
        url: '/userservice/industry/update/update',
        method: 'post',
        data
    })
  }
  
  export function deleteIndustry(id) {
    return request({
        url: '/userservice/industry/update/delete/' + id,
        method: 'delete'
    })
  }
  
  export function deleteListIndustry(idList) {
    return request({
        url: '/userservice/industry/update/deleteList/' + idList,
        method: 'delete'
    })
  }

  export function getIndustryOptions() {
    return request({
      url: '/userservice/industry/query/getSelectList',
      method: 'get'
    })
  }
