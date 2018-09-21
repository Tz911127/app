//获取当前时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
  // + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//经纬度转换
function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}
//时间戳转换
function forNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
function forTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(forNumber(date.getMonth() + 1));
  returnArr.push(forNumber(date.getDate()));

  returnArr.push(forNumber(date.getHours()));
  returnArr.push(forNumber(date.getMinutes()));
  returnArr.push(forNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
};

//格式化时间
function getTime(time) {
  var timeStr = String(time);
  var newTime = timeStr.slice(0, 4) + '-' + timeStr.slice(4, 6) + '-' + timeStr.slice(6, 8);
  return newTime;
}

function myTimeToLocal(inputTime) {
  if (!inputTime && typeof inputTime !== 'number') {
    return '';
  }
  var localTime = '';
  inputTime = new Date(inputTime).getTime();
  const offset = (new Date()).getTimezoneOffset();
  localTime = (new Date(inputTime - offset * 60000)).toISOString();
  localTime = localTime.substr(0, localTime.lastIndexOf('.'));
  localTime = localTime.replace('T', ' ');
  return localTime;
}

function format(arr) {
  function weekToInt(str) {
    switch (str) {
      case "周一":
        return 1;
      case "周二":
        return 2;
      case "周三":
        return 3;
      case "周四":
        return 4;
      case "周五":
        return 5;
      case "周六":
        return 6;
      case "周日":
        return 7;
      default:
        return "unsupported week string"
    }
  }
  var intArr = [];
  for (var i = 0; i < arr.length; i++) {
    intArr[i] = weekToInt(arr[i]);
  }
  return intArr.join();
}

function rep(str) {
  var newStr = (str.replace(/-/g, ''));
  return newStr
}


module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  forTime: forTime,
  getTime: getTime,
  myTimeToLocal: myTimeToLocal,
  format: format,
  rep: rep
}