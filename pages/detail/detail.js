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
      hasProgram: options.hasProgram,
      exception: options.exception
    });
    if (options.status != 1) {
      this.setData({
        hide: 'display:none;'
      })
    } else {
      this.setData({
        hide: 'margin:30rpx'
      })
    }
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
              proList: res.data.content.data,
              hasProgram: res.data.content.recordsTotal
              // pid: res.data.content.data.pid
            });
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
              proList: res.data.content.data,
              hasProgram: res.data.content.recordsTotal
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
              volumn: res.data.content.volumn || '',
              screenshot_time: res.data.content.screenshot_time || '',
              appVersion: res.data.content.appVersion || '',
              // settingVer: res.data.content.settingVer || '',
              target_ver: res.data.content.target_ver || '',
              op: res.data.content.op || '',
              mac: res.data.content.mac || '',
              disk_info: res.data.content.disk_info || '',
              hw_info: res.data.content.hw_info || '',
              cardModel: res.data.content.cardModel || '',
              sw_info: res.data.content.sw_info || '',
              netType: res.data.content.netType || '',
              ip: res.data.content.settingVer || '',
              screenshot: res.data.content.screenshot || ''
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
            start: that.data.start,
            terminal: that.data.no
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            that.setData({
              orderList: res.data.content.data,
            })
          }
        })
      }
    })
  },
  open_close: function() {
    var that = this
    wx.navigateTo({
      url: '../open_close/open_close?tids=' + that.data.id + '&weeks=' + that.data.weeks
    })
  },
  sounds: function() {
    var that = this
    wx.navigateTo({
      url: '../sounds/sounds?tids=' + that.data.id,
    })
  },
  restart: function() {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定当前终端要执行命令：远程重启？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ip.init + '/api/terminal/sendCommand;JSESSIONID=' + that.data.JSESSIONID,
            method: 'POST',
            data: {
              tids: that.data.id,
              command: 4,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              if (res.data.code === 1) {
                wx.showToast({
                  title: '重启成功',
                  icon: 'success',
                  duration: 2000,
                  success: function() {}
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  screen: function() {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定当前终端要执行命令：截屏？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ip.init + '/api/terminal/sendCommand;JSESSIONID=' + that.data.JSESSIONID,
            method: 'POST',
            data: {
              tids: that.data.id,
              command: 7,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              console.log(res)
              if (res.data.code === 1) {
                wx.showToast({
                  title: '截屏成功',
                  icon: 'success',
                  duration: 2000,
                  success: function() {}
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  temInfo: function() {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定当前终端要执行命令：获取信息？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ip.init + '/api/terminal/sendCommand;JSESSIONID=' + that.data.JSESSIONID,
            method: 'POST',
            data: {
              tids: that.data.id,
              command: 8,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              if (res.data.code === 1) {
                wx.showToast({
                  title: '获取信息成功',
                  icon: 'success',
                  duration: 2000,
                  success: function() {}
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  temInit: function() {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定当前终端要执行命令：初始化？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ip.init + '/api/terminal/sendCommand;JSESSIONID=' + that.data.JSESSIONID,
            method: 'POST',
            data: {
              tids: that.data.id,
              command: 9,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              if (res.data.code === 1) {
                wx.showToast({
                  title: '初始化成功',
                  icon: 'success',
                  duration: 2000,
                  success: function() {}
                })
              }
            }
          })
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
            start: that.data.start += 10,
            terminal: that.data.no
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
  },
  proStop: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要停播？',
      success: function(res) {
        console.log(res)
        if (res.confirm) {
          wx.request({
            url: ip.init + '/api/program/programManage_sendCommand_StopPlayByPids;JSESSIONID=' + that.data.JSESSIONID,
            method: 'POST',
            data: {
              tid: that.data.id,
              type: 0,
              pids: e.currentTarget.dataset.pid,
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
                      url: ip.init + '/api/terminal/getTerminalProgramPlayPageByTid;JSESSIONID=' + that.data.JSESSIONID,
                      data: {
                        tid: that.data.id,
                      },
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: function(res) {
                        that.setData({
                          proList: res.data.content.data,
                          hasProgram: res.data.content.recordsTotal
                        });
                      }
                    })
                  }, 2000)
                }
              });



            }
          })
        }

      }
    })



  },
  pre: function(e) {
    var that = this;
    console.log(e.currentTarget.dataset.pid)
    var id = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '../preview/preview?id=' + id,
    })
  }
})