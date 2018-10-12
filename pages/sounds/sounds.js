// pages/sounds/sounds.js
var ip = require('../../utils/ip.js');
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
    var that = this;
    that.setData({
      tids: options.tids
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
  getVolumn: function(e) {
    var that = this;
      that.setData({
        volumn: e.detail.value
      })

  },
  formSubmit: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })
        //  var volumn = that.data.volumn;
        if (Number(that.data.volumn) > 100 || Number(that.data.volumn) < 0) {
          wx.showToast({
            title: '请输入1-100之间的数字',
            icon: 'none'
          })
        } else {
          var volumn = that.data.volumn;
          wx.request({
            url: ip.init + '/api/terminal/sendCommand;JSESSIONID=' + res.data,
            method: 'POST',
            data: {
              tids: that.data.tids,
              command: 3,
              volumn: volumn
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              if (res.data.code === 1) {
                wx.showToast({
                  title: '音量设置成功',
                  icon: 'success',
                  duration: 2000,
                  success: function() {
                    setTimeout(function() {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 2000)


                  }
                })
              }
            }
          })
        }

      }
    })
  }
})