import request from '@/utils/request'

export function getPostOptions() {
    return request({
        url: '/userservice/post/getPostList',
        method: 'get'
    })    
}

export function getPostList(data) {
    return request({
        url: '/userservice/post/query/list',
        method: 'get',
        params: data
    })
  }
  
  export function updatePost(data) {
    return request({
        url: '/userservice/post/update/update',
        method: 'post',
        data
    })
  }
  
  export function deletePost(id) {
    return request({
        url: '/userservice/post/update/delete/' + id,
        method: 'delete'
    })
  }
  
  export function deleteListPost(idList) {
    return request({
        url: '/userservice/post/update/deleteList/' + idList,
        method: 'delete'
    })
  }

  export function getAccountListByPostId(postId) {
    return request({
      url: '/userservice/post/query/getAccountListByPostId?postId=' + postId,
      method: 'get'
    })
  }

  export function relateUser(postId, userList){
    return request({
      url: '/userservice/post/update/relateUser',
      method: 'post',
      params: {"postId": postId, "selectedUserList": userList.toString()}
    })
  }