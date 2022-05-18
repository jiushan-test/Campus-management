import request from '@/utils/request'

export function getMyNotice(params) {
  return request({
    url: '/student/getMyNotices',
    method: 'get',
    params
  })
}

export function goUnread(params) {
  return request({
    url: '/student/goUnread',
    method: 'get',
    params
  })
}

export function goRead(params) {
  return request({
    url: '/student/goRead',
    method: 'get',
    params
  })
}

export function getNoticeRead(params) {
  return request({
    url: '/student/getNoticeRead',
    method: 'get',
    params
  })
}

export function submitHealthList(data) {
  return request({
    url: '/student/submitHealthList',
    method: 'post',
    data
  })
}

export function getMyHealthListToday(params) {
  return request({
    url: '/student/getMyHealthListToday',
    method: 'get',
    params
  })
}

export function getHealthListSizeToday() {
  return request({
    url: '/student/gethealthNowDay',
    method: 'get'
  })
}

export function getMyApplication(params) {
  return request({
    url: '/student/getMyApplication',
    method: 'get',
    params
  })
}

export function submitApplication(data) {
  return request({
    url: '/student/submitApplication',
    method: 'post',
    data
  })
}
