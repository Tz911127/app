var pwd = require('../../utils/pwd.js');
var ip = require('../../utils/ip.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain: '',
    account: '',
    password: ''
  },
  codeInput: function(e) {
    this.setData({
      domain: e.detail.value
    });

  },

  // 获取输入账号
  phoneInput: function(e) {
    if (e.detail.value) {
      this.setData({
        account: e.detail.value
      })
    } else {
      console.log(12)
    }

  },

  // 获取输入密码
  passwordInput: function(e) {

    this.setData({
      password: pwd.md5_pwd(e.detail.value.pwd)
    });


  },

  formSubmit: function(e) {
    if (e.detail.value.code == '' || e.detail.value.no == '' || e.detail.value.pwd == '') {
      wx.showToast({
        title: "公司代码，用户名，密码不能为空",
      })
    } else {
      wx.request({
        url: ip.init + '/api/auth/login',
        method: 'POST',
        data: {
          domain: e.detail.value.code,
          account: e.detail.value.no,
          password: pwd.md5_pwd(e.detail.value.pwd)
        },

        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {

          if (res.data.code === 1) {
            wx.setStorage({
              key: "sessionid",
              data: res.data.content.sessionid
            });
            wx.setStorage({
              key: 'token',
              data: res.data.content.token,
            });
            wx.setStorage({
              key: 'account',
              data: res.data.content.account,
            })
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              success: function() {
                wx.switchTab({
                  url: '../home/home',
                })

              }
            })
          } else {
            wx.showToast({
              title: res.data.message,
            })
          }

        }
      })
    }

  }


});