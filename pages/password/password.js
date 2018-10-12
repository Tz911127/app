// pages/password/password.js
var ip = require('../../utils/ip.js')
var pwd = require('../../utils/pwd.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        });
      },
    }, )
  },

  formSubmit: function(e) {
    var that = this;
    var newPwd = pwd.md5_pwd(e.detail.value.newPwd)
    var oldPwd = pwd.md5_pwd(e.detail.value.oldPwd)
    var surePwd = pwd.md5_pwd(e.detail.value.surePwd)
    wx.request({
      url: ip.init + '/api/auth/updatePwd;JSESSIONID=' + that.data.JSESSIONID,
      method: "POST",
      data: {
        password: oldPwd,
        newPassword: newPwd,
        reNewPassword: surePwd
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        if(res.data.code == 1) {
          wx.showToast({
            title: '密码修改成功',
            success:function(e){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                });
              },2000)
            }
          });
          
        }else {
          wx.showToast({
            title: '密码错误/密码为空',
            icon:'none'
          })
        }
      }
    })
  }
})