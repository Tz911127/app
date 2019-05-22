// pages/examine/examine.js

var ip = require('../../utils/ip.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    dataList: [],
    dataMatList: [],
    firChe: false,
    lasChe: false,
    matChe: false,
  },
  onShareAppMessage(e) {
    if (e.from === 'button') {
      console.log(e.target)
    }
    return {
      title: '转发'
    }
  },
  onShow: function(e) {
    var that = this;
    wx.getStorage({
      key: 'perms',
      success: function(res) {
        that.setData({
          perms: res.data
        })
      },
    })
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })
        var perms = that.data.perms;
        for (var i = 0; i < perms.length; i++) {
          if (perms[i] === '5' ) {
            wx.request({
              url: ip.init + '/api/program/getCheckProgramList;JSESSIONID=' + res.data,
              method: 'POST',
              data: {
                oid: 0,
                length: 10,
                start: 0
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function(res) {
                if (res.data.code == 1) {
                  that.setData({
                    dataList: res.data.content.data,
                  });
                  if (that.data.dataList.length > 0 || that.data.dataMatList.length > 0) {
                    wx.showTabBarRedDot({
                      index: 3,
                    })
                  } else {
                    wx.hideTabBarRedDot({
                      index: 3,
                    })
                  }
                }

              }
            });
            wx.request({
              url: ip.init + '/api/material/materialCheck_getMaterialCheckList;JSESSIONID=' + res.data,
              method: 'POST',
              data: {
                oid: 0,
                length: 10,
                start: 0
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {

                if (res.data.code == 1) {
                  that.setData({
                    dataMatList: res.data.content.data
                  })
                }
              }
            })
          };
          if(perms[i] ==='5'&&perms[i] ==='51'){
            wx.request({
              url: ip.init + '/api/material/materialCheck_getMaterialCheckList;JSESSIONID=' + res.data,
              method: 'POST',
              data: {
                oid: 0,
                length: 10,
                start: 0
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                if (res.data.code == 1) {
                  that.setData({
                    dataMatList: res.data.content.data
                  });
                  if (that.data.dataList.length > 0 || that.data.dataMatList.length > 0) {
                    wx.showTabBarRedDot({
                      index: 3,
                    })
                  } else {
                    wx.hideTabBarRedDot({
                      index: 3,
                    })
                  }
                }
              }
            });
          }
        }


      }
    });

    wx.getStorage({
      key: 'perms',
      success: function(res) {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i] == '532') {
            that.setData({
              firChe: true
            })
          };
          if (res.data[i] == '533') {
            that.setData({
              lasChe: true
            })
          };
          if (res.data[i] == '51') {
            that.setData({
              matChe: true
            })
          }
        }
      },
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
          url: ip.init + '/api/program/getCheckProgramList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            oid: 0,
            length: 10,
            start: 0
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            if (res.data.code == 1) {
              that.setData({
                dataList: res.data.content.data
              })
            }

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
          url: ip.init + '/api/material/materialCheck_getMaterialCheckList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            oid: 0,
            length: 10,
            start: 0
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {

            if (res.data.code == 1) {
              that.setData({
                dataMatList: res.data.content.data
              })
            }
          }
        })
      }
    })

  },

  pre_mate: function(e) {
    var path = e.currentTarget.dataset.path;
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    path = encodeURIComponent(path)
    console.log(path)
    wx.navigateTo({
      url: '../exa_mate/exa_mate?id=' + id + '&type=' + type + '&path=' + path,
    })

  },
  preview: function(e) {
    // var id = this.data.id;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../preview/preview?id=' + id,
    })
  },

  exa: function(e) {
    var id = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status
    var that = this;
    if (status == 4 || status == 6) {
      wx.showModal({
        title: '',
        content: status == 6 ? '确定审核通过' : '审核不通过',
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: ip.init + '/api/program/check;JSESSIONID=' + that.data.JSESSIONID,
              method: 'POST',
              data: {
                id: id,
                status: status
              },
              header: {
                'Content-Type': "application/x-www-form-urlencoded"
              },
              success: function(res) {
                wx.showToast({
                  title: status == 6 ? '审核通过' : '审核不通过',
                  icon: 'none',
                  success: function(res) {
                    wx.request({
                      url: ip.init + '/api/program/getCheckProgramList;JSESSIONID=' + that.data.JSESSIONID,
                      method: 'POST',
                      data: {
                        oid: 0,
                        length: 10,
                        start: 0
                      },
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: function(res) {
                        that.setData({
                          dataList: res.data.content.data
                        });
                        if (res.data.content.data.length == 0) {
                          wx.hideTabBarRedDot({
                            index: 3,
                          })
                        }
                      }
                    })
                  }
                })
              }
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showModal({
        title: '',
        content: status == 6 ? '审核不通过' : '确定审核通过',
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: ip.init + '/api/program/checkFinal;JSESSIONID=' + that.data.JSESSIONID,
              method: 'POST',
              data: {
                id: id,
                status: status
              },
              header: {
                'Content-Type': "application/x-www-form-urlencoded"
              },
              success: function(res) {
                wx.showToast({
                  title: status == 3 ? '审核通过' : '审核不通过',
                  icon: 'none',
                  success: function(res) {
                    wx.request({
                      url: ip.init + '/api/program/getCheckProgramList;JSESSIONID=' + that.data.JSESSIONID,
                      method: 'POST',
                      data: {
                        oid: 0,
                        length: 10,
                        start: 0
                      },
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: function(res) {
                        that.setData({
                          dataList: res.data.content.data
                        });
                        if (res.data.content.data.length == 0) {
                          wx.hideTabBarRedDot({
                            index: 3,
                          })
                        }
                      }
                    })
                  }
                })
              }
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }


  },
})