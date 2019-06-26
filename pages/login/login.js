var pwd = require('../../utils/pwd.js');
var ip = require('../../utils/ip.js');
var base = require('../../utils/base.js');
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {},
  onLoad: function(e) {
    var that = this;
    wx.getStorage({
      key: 'domain',
      success: function(res) {
        that.setData({
          domain: res.data
        })
      },
    });
    wx.getStorage({
      key: 'account',
      success: function(res) {
        that.setData({
          account: res.data
        })
      },
    });
    wx.getStorage({
      key: 'password',
      success: function(res) {
        that.setData({
          password: base.decode(res.data)
        });
      },
    });

    
  },
  formSubmit: function(e) {
    var that = this;
    if (e.detail.value.code == '' || e.detail.value.no == '' || e.detail.value.pwd == '') {
      wx.showToast({
        title: "公司代码，用户名，密码不能为空",
        icon: 'none'
      })
    } else {
      that.setData({
        domain: e.detail.value.code,
        account: e.detail.value.no,
        // password: e.detail.value.pwd.length == 32 ? e.detail.value.pwd : pwd.md5_pwd(e.detail.value.pwd)
        password: (e.detail.value.pwd)
      });
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: ip.init + '/api/auth/login',
        method: 'POST',
        data: {
          domain: e.detail.value.code,
          account: e.detail.value.no,
          password: pwd.md5_pwd(that.data.password)
          // password: 'b898108842924a5454e1f135a851f0ea'
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
            });
            wx.setStorage({
              key: 'domain',
              data: that.data.domain,
            });
            wx.setStorage({
              key: 'password',
              data: base.encode(that.data.password),
            });
            wx.hideLoading();
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
              icon: 'none',
            })
          }

        }
      })
    }

  }

});