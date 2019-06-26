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
    let that = this;
    wx.getStorage({
      key: 'root_terminalReslotions',
      success: function(res) {
        that.setData({
          tem_res: res.data
        })
      },
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