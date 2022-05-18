import request from '@/utils/request'

export function addClass(data) {
  return request({
    url: '/admin/addClass',
    method: 'post',
    data
  })
}

export function getClasses() {
  return request({
    url: '/admin/getClasses',
    method: 'get'
  })
}

export function getClassesByPage(params) {
  return request({
    url: '/admin/getClassesByPage',
    method: 'get',
    params
  })
}

export function searchClass(params) {
  return request({
    url: '/admin/searchClass',
    method: 'get',
    params
  })
}

export function removeClass(params) {
  return request({
    url: '/admin/removeClass',
    method: 'get',
    params
  })
}

export function searchData(params) {
  return request({
    url: '/admin/getUsersByTypeAndChar',
    method: 'get',
    params
  })
}

export function announce(data) {
  return request({
    url: '/admin/announce',
    method: 'post',
    data
  })
}

export function getAllNotices(params) {
  return request({
    url: '/admin/getAllNotices',
    method: 'get',
    params
  })
}

export function getNoticeDetail(params) {
  return request({
    url: '/admin/getNoticeDetail',
    method: 'get',
    params
  })
}

export function delNotice(params) {
  return request({
    url: '/admin/delNotice',
    method: 'get',
    params
  })
}

export function getApplication(params) {
  return request({
    url: '/admin/getApplication',
    method: 'get',
    params
  })
}

export function upLeaveState(params) {
  return request({
    url: '/admin/upLeaveState',
    method: 'get',
    params
  })
}

export function getHealthByClass(params) {
  return request({
    url: '/admin/getHealthByClass',
    method: 'get',
    params
  })
}

export function getStudentNum(params) {
  return request({
    url: '/admin/getStudentNum',
    method: 'get',
    params
  })
}
