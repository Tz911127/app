// pages/me/me.js
var ip = require('../../utils/ip.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShareAppMessage(e) {
    if (e.from === 'button') {
      console.log(e.target)
    }
    return {
      title: '转发'
    }
  },
  onShow: function(e) {
    var that = this;
    wx.getStorage({
      key: 'account',
      success: function(res) {
        that.setData({
          account: res.data
        })
      },
    });
    wx.getStorage({
      key: 'domainName',
      success: function(res) {
        that.setData({
          domainName: res.data
        })
      },
    });
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })
      },
    })
  },

  quit: function() {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定退出？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ip.init + '/api/auth/logout' ,
            method: 'post',
            data: {},
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              if(res.data.code == 1){
                wx.redirectTo({
                  url: '../login/login',
                });
                wx.removeStorage({
                  key: 'perms',
                });
                wx.removeStorage({
                  key: 'organizations',
                });
              }
             
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  pwd: function() {
    wx.navigateTo({
      url: '../password/password',
    })
  },
  about: function() {
    wx.navigateTo({
      url: '../about/about',
    })
  }
})