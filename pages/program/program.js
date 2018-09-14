// pages/terminal/terminal.js
var ip = require('../../utils/ip.js')
var start_clientX;
var end_clientX;
Page({
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    start: 0,
    dataList: []
  },

  onShow: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        console.log(res.data);
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/program/getProgramList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            oid: 0,
            length: 10,
            start: that.data.start
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            that.setData({
              dataList: res.data.content.data
            })
          }
        })
      }
    })

  },



  filter: function() {
    this.setData({
      display: "block",
      position: "position:fixed",
      translate: 'transform: translateX(-' + this.data.windowWidth * 0.7 + 'px);'
    });


  },
  // 遮拦
  hideview: function() {
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
    })
  },

  upArea: function() {
    wx.navigateTo({
      url: '../area/area',
    })
  },

  detail: function() {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  preview: function() {
    wx.navigateTo({
      url: '../preview/preview',
    })
  },
  pub: function() {
    wx.navigateTo({
      url: '../pub/pub',
    })
  },
  proDetail: function() {
    wx.navigateTo({
      url: '../proDetail/proDetail',
    })
  },
  lower: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/program/getProgramList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            // oid: 0,
            length: 10,
            start: that.data.start += 10
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            that.setData({
              dataList: that.data.dataList.concat(res.data.content.data) 
            })
          }
        })
      }
    })
  },
  scroll: function(e) {
    // console.log(e)
  },
})