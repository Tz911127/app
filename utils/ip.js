// var ip = "https://ssl.q-media.cn";//正式
 var ip = "https://ssl.e-media.vip";//测试

function init(){
  return ip
};
//终端数据
// 获取终端列表
function getTerList(){
  let that = this;
  wx.request({
    url: ip + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
    method: 'POST',
    data: {
      oid: that.data.oid,
      length: 10,
      start: that.data.start
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {

      if (res.data.code == 2) {
        wx.redirectTo({
          url: '../login/login',
        })
      }
      that.setData({
        datalist: res.data.content.data,
        bg: 'background:red'
      });

    }
  });
};
module.exports = {
  init: init(),
}