// pages/area_city/area_city.js
var cityData = require("../../utils/city.js");
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
    var code = options.code;

    for (var i in cityData.init) {
      this.setData({
        cities: cityData.init[code],
        provinceCode: options.code
      })
    }
    // console.log(this.data.cities);
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
  click: function(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 3];
    prevPage.setData({
      city_no: e.currentTarget.dataset.code,
      city_name: e.currentTarget.dataset.name,
      provinceCode: this.data.provinceCode
    });
    wx.navigateBack({
      delta: 2
    });
    // console.log(this.data.provinceCode, e.currentTarget.dataset.code)
  }
})