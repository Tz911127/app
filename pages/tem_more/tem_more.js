// pages/tem_more/tem_more.js
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
      oid:options.oid
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
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        });
        wx.request({
          url: ip.init + '/api/terminal/getTerminalGroups;JSESSIONID=' + res.data,
          method: 'GET',
          data: {
            oid: that.data.oid
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            that.setData({
              dataList: res.data.content
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
  bindFunc: function(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let team_fir;
    for(let i =0;i<this.data.dataList.length;i++){
      if (e.currentTarget.dataset.text === this.data.dataList[i].id) {
        team_fir = this.data.dataList[i].name
      }
    }
    prevPage.setData({
      gid: e.currentTarget.dataset.text,
      team_fir: team_fir,
      teHide_fir: "background:#096dd9;color:#fff",
      teHide_sec: ''
    });
    wx.navigateBack({
      delta: 1
    });
  }
})