// pages/pro_more/pro_more.js
var ip = require('../../utils/ip.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tem_res:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getStorage({
      key: 'root_programReslotions',
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
      hideRes_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      hideRes_sec: ''
    });
    wx.navigateBack({
      delta: 1
    });
    console.log(e)
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

  }
})