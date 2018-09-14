// pages/scan/scan.js
var util = require('../../utils/util.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var ip = require('../../utils/ip.js')
var qqmapsdk;
var formatLocation = util.formatLocation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: '',
    hasLocation: false,
    token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this;
    wx.scanCode({
      success: function(res) {
        that.setData({
          result: res.result
        });
      },
      fail: function(res) {}
    });

    qqmapsdk = new QQMapWX({
      key: 'DFUBZ-FSIC6-P7OS7-MNHFC-IRRKK-L3FJJ'
    });


    wx.getLocation({
      success: function(res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(address) {
            that.setData({
              locationAddress: address.result.address
            })
          }
        })
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data
        })
      },
    })
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/client/assit/descryptQR;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            token: that.data.token,
            qr: "bb7f3ce66a5858d03350e3f26d6cde2c7a28e8384f12a5d938a13445169779b6cf8d0264253fccfe0e8093d4ad570c1a"
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            console.log(res)
            that.setData({
              // datalist: res.data.content.data
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  chooseLocation: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          hasLocation: true,
          locationAddress: res.address
        })
      }
    })
  },

})