function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

/**
 * 封装微信请求方便本地开发
 * @param url
 * @param method
 * @param data
 * @param callback
 */
export function http (url, method, data, callback) {
  wx.request({
    url: `https://www.feilong.fun${url}`,
    method: method,
    data: data,
    success: (res) => {
      callback && callback(res)
    }
  })
}

export default {
  formatNumber,
  formatTime,
  http
}
