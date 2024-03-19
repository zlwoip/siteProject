import Cookies from 'js-cookie'

const TokenKey = 'user-token'

export function getToken() {
  return Cookies.get(TokenKey) || null
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: 1 })
  } else return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
