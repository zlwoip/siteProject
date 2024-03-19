import Vue from 'vue'
import request from './axios.config'

Vue.prototype.$http = function ({ url, data, method = 'GET', headers, beforeRequest, afterRequest }) {
  const successHandler = res => {
    return res
  }
  const failHandler = error => {
    afterRequest && afterRequest()
    throw new Error(error.msg || '请求失败，未知异常')
  }
  beforeRequest && beforeRequest()
  if (method === 'GET') {
    return request.get(url, { params: data }).then(successHandler, failHandler)
  } else if (method === 'POST') {
    return request.post(url, data, { headers }).then(successHandler, failHandler)
  } else if (method === 'DELETE') {
    return request.delete(url, { params: data }).then(successHandler, failHandler)
  } else if (method === 'PUT') {
    return request.put(url, data, { headers }).then(successHandler, failHandler)
  } else {
    return method === 'GET' ? request.get(url, { params: data }).then(successHandler, failHandler) : request.post(url, data, { headers }).then(successHandler, failHandler)
  }
}

Vue.prototype.$httpGet = function ({ url, data, beforeRequest = null, afterRequest = null }) {
  return this.$http({ url, method: 'GET', data, beforeRequest, afterRequest })
}

Vue.prototype.$httpPost = function ({ url, data, headers, beforeRequest = null, afterRequest = null }) {
  return this.$http({ url, method: 'POST', data, headers, beforeRequest, afterRequest })
}

Vue.prototype.$httpPut = function ({ url, data, headers, beforeRequest = null, afterRequest = null }) {
  return this.$http({ url, method: 'PUT', data, headers, beforeRequest, afterRequest })
}

Vue.prototype.$httpDelete = function ({ url, data, headers, beforeRequest = null, afterRequest = null }) {
  return this.$http({ url, method: 'DELETE', data, headers, beforeRequest, afterRequest })
}
