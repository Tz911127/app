// pages/open_ter/open_ter.js
var ip = require('../../utils/ip.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: 0,
    datalist: [],
    search: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        });
        that.getDate()
        /* wx.request({
           url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
           method: 'get',
           data: {
             share: 1,
             length: 10,
             start: 0
           },
           header: {
             'content-type': 'application/json' // 默认值
           },
           success: function(res) {
             that.setData({
               datalist: res.data.content.data
             })
           }
         })*/
      },
    })
  },
  getDate() {
    let that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        wx.request({
          url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
          method: 'get',
          data: {
            share: 1,
            length: 10,
            start: 0
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            that.setData({
              datalist: res.data.content.data
            })
          }
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
    this.getDate()
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
  scroll: function(e) {},
  lower: function(e) {
    let that = this;
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      method: 'get',
      data: {
        share: 1,
        length: 10,
        start: that.data.start += 10,
        search: that.data.search
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          datalist: that.data.datalist.concat(res.data.content.data),
        });
      }
    })
  },
  search: function(e) {
    let that = this;
    that.setData({
      search: e.detail.value || '',
    })
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      method: 'GET',
      data: {
        share: 1,
        length: 10,
        start: 0,
        search: e.detail.value || '',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.setData({
          datalist: res.data.content.data
        })
      }
    });
  },
  add_open: function(e) {
    wx.navigateTo({
      url: '../open_add/open_add',
    })
  },
  edit_open: function(e) {
    wx.navigateTo({
      url: '../open_edit/open_edit',
    })
  }

})