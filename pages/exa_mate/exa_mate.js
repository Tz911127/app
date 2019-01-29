// pages/exa_mate/exa_mate.js
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
    console.log(options)
    this.setData({
      path: decodeURIComponent(options.path),
      id: options.id,
      type: options.type
    })
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
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
  exa: function(e) {
    var status = e.currentTarget.dataset.status;
    status = Number(status);
    var that = this;
    wx.showModal({
      content: status == 3 ? '确定通过素材' : '确定不通过素材',
      success: function() {
        wx.request({
          url: ip.init + '/api/material/materialCheck_check;JSESSIONID=' + that.data.JSESSIONID,
          method: 'POST',
          data: {
            status: status,
            id: that.data.id
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
              wx.navigateBack({
                delta: 1
              });
          }
        })
      }
    })

  }
})