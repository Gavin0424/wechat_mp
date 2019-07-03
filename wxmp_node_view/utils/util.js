const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 用于将datetime格式转化为常规时间格式
 */
const transDatetime = mescStr => {
  const n = mescStr;
  const date = new Date(n);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return (Y + M + D + ' ' + hour + minute + second)
}

const transDate = mescStr => {
  const n = mescStr;
  const date = new Date(n);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
  const hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return (Y + M + D)
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  transDate: transDate,
  transDatetime: transDatetime
}
