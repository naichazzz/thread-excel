import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setTablist(tablist) {
  return Cookies.set('tablist', tablist)
}
export function getTablist() {
  return Cookies.get('tablist')
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
