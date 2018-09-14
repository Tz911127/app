var md5 = require('./md5.js')
function md5_pwd(pwd) {
  var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
  ];
  var enStr = md5.hex_md5(pwd + "dmbd!@#$%^&*");
  var str = '';
  for (var i = 0; i < enStr.length; i++) {
    for (var j = 0; j < hexDigits.length; j++) {
      if (hexDigits[j] == enStr.charAt(i)) {
        j = j + 1;
        str += hexDigits[j == hexDigits.length ? 0 : j];
      }
    }
  }
  return str;
}

module.exports = {
  md5_pwd: md5_pwd
}