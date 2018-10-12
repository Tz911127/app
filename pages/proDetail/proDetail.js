// pages/proDetail/proDetail.js
var ip = require('../../utils/ip.js');
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    start: 0

  },
  onLoad: function(options) {
    this.setData({
      id: options.id,
      playTers: options.playTers,
      name: options.name
    });
  },
  onShow: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
            JSESSIONID: res.data
          }),

          //节目
          wx.request({
            url: ip.init + '/api/program/getProgramById;JSESSIONID=' + res.data,
            method: 'POST',
            data: {
              id: that.data.id,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              console.log(res.data)
              that.setData({
                dataList: res.data.content,
                pixel: res.data.content.pixelHorizontal + '*' + res.data.content.pixelVertical,
                createTime: utils.myTimeToLocal(res.data.content.createTime),

              })
            }
          }),

          //终端
          wx.request({
            url: ip.init + '/api/program/getProgramPlayPageByPid;JSESSIONID=' + res.data,
            method: 'POST',
            data: {
              pid: that.data.id,
              oid: 0,
              length: 10,
              start: 0
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              that.setData({
                temList: res.data.content.data,
                playTers: res.data.content.recordsTotal
              })
            }
          })

      }
    })
  },
  selected: function(e) {
    this.setData({
      selected1: false,
      selected: true,
    });
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/program/getProgramById;JSESSIONID=' + res.data,
          // method: 'POST',
          data: {
            id: that.data.id,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            // console.log(res.data)
            that.setData({
              dataList: res.data.content
            })
          }
        })
      }
    })
  },
  selected1: function(e) {
    this.setData({
      selected: false,
      selected1: true,
    });
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/programCmd/getProgramCmdPageList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            length: 10,
            start: that.data.start,
            program: that.data.name
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            // console.log(res.data)
            that.setData({
              orderList: res.data.content.data
            })
          }
        })
      }
    })
  },
  scroll: function(e) {

  },
  lower: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/programCmd/getProgramCmdPageList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            length: 10,
            start: that.data.start += 10,
            program: that.data.name
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            that.setData({
              orderList: that.data.orderList.concat(res.data.content.data)
            })
          }
        })
      }
    })
  },
  proStop: function(e) {
    var that = this;
    // wx.showModal({
    //   title: '',
    //   content: '',
    // })
    wx.request({
      url: ip.init + '/api/program/programManage_sendCommand;JSESSIONID=' + that.data.JSESSIONID,
      method: 'POST',
      data: {
        tids: e.currentTarget.dataset.tid,
        type: 0,
        pid: that.data.id,
        oid: 0,
        gid: '',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          success: function(res) {
            setTimeout(function() {
              wx.request({
                url: ip.init + '/api/program/getProgramPlayPageByPid;JSESSIONID=' + that.data.JSESSIONID,
                method: 'POST',
                data: {
                  pid: that.data.id,
                  oid: 0,
                  length: 10,
                  start: 0
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: function(res) {
                  console.log(res.data)
                  that.setData({
                    temList: res.data.content.data,
                    playTers: res.data.content.recordsTotal,
                  })
                }
              })
            }, 2000)

          }
        });

      }
    })
  }
})