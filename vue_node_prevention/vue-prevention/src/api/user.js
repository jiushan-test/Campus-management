import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/getUserDataByToken',
    method: 'get'
    // params: { token }
  })
}

export function getUsersData(params) {
  return request({
    url: '/user/getUsersByTypePage',
    method: 'get',
    params
  })
}

export function getUserSize(params) {
  return request({
    url: '/user/getUserSize',
    method: 'get',
    params
  })
}

export function removeUserData(params) {
  return request({
    url: '/user/removeUserData',
    method: 'get',
    params
  })
}

export function setXlsxData() {
  return request({
    url: '/user/setXlsxData',
    method: 'post'
  })
}

export function editUserData(data) {
  return request({
    url: '/user/editUserData',
    method: 'post',
    data
  })
}

export function getAvatar(params) {
  return request({
    url: '/user/getAvatar',
    method: 'get',
    params
  })
}

export function updatePsw(data) {
  return request({
    url: '/user/updatePsw',
    method: 'post',
    data
  })
}
