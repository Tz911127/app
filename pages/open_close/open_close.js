// pages/setTime/setTime.js
var ip = require('../../utils/ip.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '00:00',
    endTime: '23:59'
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      tids: options.tids,
      weeks: options.weeks
    })
  },


  bindStartTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  btn: function() {
    var that = this;
    this.setData({
      start_h: this.data.startTime.split(':')[0],
      start_m: this.data.startTime.split(':')[1],
      end_h: this.data.endTime.split(':')[0],
      end_m: this.data.endTime.split(':')[1],
    })
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })
        wx.request({
          url: ip.init + '/api/terminal/sendCommand;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            tids: that.data.tids,
            command: 2,
            start_h: that.data.start_h,
            start_m: that.data.start_m,
            end_h: that.data.end_h,
            end_m: that.data.end_m,
            week: that.data.weeks
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            if (res.data.code === 1) {
              wx.showToast({
                title: '快关机时间设置成功',
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
    })

  }
})