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
      weeks: options.weeks,
      name: options.name
    });
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        wx.request({
          url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            search: that.data.name
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            if (res.data.content.data[0].workCron) {
              let time = res.data.content.data[0].workCron;
              let startTime = time.split('?')[0].split(' ');
              let endTime = time.split('?')[1].split('/')[1].split(' ')
              that.setData({
                startTime: (startTime[2] > 9 ? startTime[2] : '0' + startTime[2]) + ':' + (startTime[1] > 9 ? startTime[1] : '0' + startTime[1]),
                endTime: (endTime[2] > 9 ? endTime[2] : '0' + endTime[2]) + ':' + (endTime[1] > 9 ? endTime[1] : '0' + endTime[1])
              })
            }
          }
        });

      },
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
    if (that.data.end_h < that.data.start_h) {
      wx.showToast({
        title: '关机时间不能小于开机时间',
        icon: 'none'
      })
    } else {
      if (that.data.end_h == that.data.start_h && that.data.end_m <= that.data.start_m) {

        wx.showToast({
          title: '关机时间不能小于开机时间',
          icon: 'none'
        })
        // }
      } else {
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
                end_h: (that.data.end_h == 23 && that.data.end_m == 59) ? 24 : that.data.end_h,
                end_m: (that.data.end_h == 23 && that.data.end_m == 59) ? 0 : that.data.end_m,
                week: '1,2,3,4,5,6,7'
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function(res) {
                if (res.data.code === 1) {
                  wx.showToast({
                    title: '设置成功',
                    icon: 'none',
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
    }


  }
})