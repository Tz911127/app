var pwd = require('../../utils/pwd.js');
var ip = require('../../utils/ip.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: 'whkm',
    account: 'xuweilin',
    password: 'Kmsz123456'
  },
  codeInput: function(e) {
    this.setData({
      domain: e.detail.value
    })
  },

  // 获取输入账号
  phoneInput: function(e) {
    this.setData({
      account: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function(e) {

    this.setData({
      password: pwd.md5_pwd(e.detail.value.pwd)
    });


  },

  formSubmit: function(e) {

    wx.request({
      url: ip.init + '/api/auth/login',
      method:'POST',
      data: {
        domain: e.detail.value.code,
        account: e.detail.value.no,
        password: pwd.md5_pwd(e.detail.value.pwd)
      },

      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log(res);
        wx.setStorage({
          key: "sessionid",
          data: res.data.content.sessionid
        });
        wx.setStorage({
          key: 'token',
          data: res.data.content.token,
        })
        if (res.data.code === 1) {
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000,
              success:function(){
                setTimeout(function () {
                  wx.switchTab({
                    url: '../home/home',
                  })
                }, 2000)

              }
            })
        }
        else {
          wx.showToast({
            title: res.data.message,
          })
        }

      }
    })







  }


});