// pages/res_more/res_more.js
var ip = require('../../utils/ip.js')
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
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        });
        wx.request({
          url: ip.init + '/api/auth/getUserSrc;JSESSIONID=' + res.data,
          method: 'GET',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            that.setData({
              tem_res: res.data.content.root_terminalReslotions
            })
          }
        })
      }

    })
  },

  bindFunc: function(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      resolution: e.currentTarget.dataset.text,
      hide_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      hide_sec: ''

    });
    wx.navigateBack({
      delta: 1
    });
  }

})