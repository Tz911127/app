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

//百度地图经纬度转腾讯地图经纬度
function bMapTransQQMap(lng, lat, iconPath, width, height) {
  let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  let x = lng - 0.0065;
  let y = lat - 0.006;
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  let longitude = z * Math.cos(theta);
  let latitude = z * Math.sin(theta);
  return {
    longitude: longitude,
    latitude: latitude,
    iconPath: iconPath,
    width: width,
    height: height
  } 
}



//腾讯地图经纬度转百度地图经纬度
function qqMapTransBMap(lng, lat) {
  let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  let x = lng;
  let y = lat;
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  let longitude = z * Math.cos(theta) + 0.0065;
  let latitude = z * Math.sin(theta) + 0.006;
  return {
    longitude: longitude,
    latitude: latitude
  }
};


//时间交叉
function checkCross(times, timeItem) {                
  function cross(a1, a2, b1, b2) {                    
    if (b1 == a1 && b2 == a2) {                        
      return true;                    
    } else if (b2 <= a1) {                        
      return false;                    
    } else if (b2 > a1 && b1 >= a2) {                        
      return false;                    
    } else if (b1 >= a2) {                        
      return false;                    
    } else if (b1 < a2 && b2 <= a1) {                        
      return false;                    
    } else {                        
      return true;                    
    }                
  }                
  var result = {                    
    cross: []                
  };                
  for (let i = 0; i < times.length; i++) {                    
    let differenctDays = [];

    var timeI = timeItem.weeks.split(',');
    for (var j = 0; j < timeI.length; j++) {
      if (times[i].weeks.indexOf(timeI[j])>-1) {
        differenctDays.push(timeI[j])
      }
    }


                
    if (differenctDays.length) {                        
      let a1 = parseInt(timeItem.startTime.split(':')[0] * 60) + parseInt(timeItem.startTime.split(':')[1]);                        
      let b1 = parseInt(timeItem.endTime.split(':')[0] * 60) + parseInt(timeItem.endTime.split(':')[1]);                        
      let a2 = parseInt(times[i].startTime.split(':')[0] * 60) + parseInt(times[i].startTime.split(':')[1]);                        
      let b2 = parseInt(times[i].endTime.split(':')[0] * 60) + parseInt(times[i].endTime.split(':')[1]);                        
      if (cross(a1, b1, a2, b2)) {                            
        result.cross.push(times[i]);                        
      }                    
    }                
  }             
  // console.log(result.cross.length)   
  return result;            
}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  forTime: forTime,
  getTime: getTime,
  myTimeToLocal: myTimeToLocal,
  format: format,
  rep: rep,
  bMapTransQQMap: bMapTransQQMap,
  qqMapTransBMap: qqMapTransBMap,
  checkCross: checkCross
}