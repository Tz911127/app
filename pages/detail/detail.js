var ip = require('../../utils/ip.js')
var utils = require('../../utils/util.js')
Page({
  data: {
    selected: true,
    selected1: false,
    selected2: false,
    start: 0,
    orderList: []
  },

  onLoad: function(options) {
    this.setData({
      id: options.id,
      name: options.name,
      no: options.no,
      status: options.status,
      resolution: options.resolution,
      hasProgram: options.hasProgram
    });
  },
  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/terminal/getTerminalProgramPlayPageByTid;JSESSIONID=' + res.data,
          // method: 'POST',
          data: {
            tid: that.data.id,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            that.setData({
              proList: res.data.content.data
            })
          }
        })
      },
    })
  },
  selected: function(e) {
    this.setData({
      selected1: false,
      selected: true,
      selected2: false
    });

    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/terminal/getTerminalProgramPlayPageByTid;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            tid: that.data.id,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            console.log(res.data.content.data)
            that.setData({
              proList: res.data.content.data
            })
          }
        })
      },
    })

  },
  selected1: function(e) {
    this.setData({
      selected: false,
      selected1: true,
      selected2: false
    });
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/terminal/getTerminalInfo;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            tid: that.data.id,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            that.setData({
              datalist: res.data.content,
              billingDate: utils.getTime(res.data.content.billingDate),
              dueDate: utils.getTime(res.data.content.dueDate),
              terminal_time: utils.myTimeToLocal(res.data.content.terminal_time),
              sync_time: utils.myTimeToLocal(res.data.content.sync_time),
              lastOnline: utils.myTimeToLocal(res.data.content.lastOnline),

            })
          }
        })
      }
    })

  },
  selected2: function(e) {
    this.setData({
      selected: false,
      selected2: true,
      selected1: false,
    });
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/terminalCmd/getTerminalCmdPageList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            length: 10,
            start: that.data.start
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            console.log(res.data);
            that.setData({
              orderList: res.data.content.data,
            })
          }
        })
      }
    })
  },
  open_close: function() {
    wx.navigateTo({
      url: '../open_close/open_close',
    })
  },
  sounds: function() {
    wx.navigateTo({
      url: '../sounds/sounds',
    })
  },
  restart: function() {
    wx.showModal({
      title: '',
      content: '确定当前终端要执行命令：远程重启？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  screen: function() {
    wx.showModal({
      title: '',
      content: '确定当前终端要执行命令：截屏？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  temInfo: function() {
    wx.showModal({
      title: '',
      content: '确定当前终端要执行命令：获取信息？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  temInit: function() {
    wx.showModal({
      title: '',
      content: '确定当前终端要执行命令：初始化？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
          url: ip.init + '/api/terminalCmd/getTerminalCmdPageList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            length: 10,
            start: that.data.start += 10
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            that.setData({
              orderList: that.data.orderList.concat(res.data.content.data),
            })
          }
        })
      }
    })
  }
})