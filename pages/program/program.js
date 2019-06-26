// pages/terminal/terminal.js
var ip = require('../../utils/ip.js')
var util = require('../../utils/util.js')
var start_clientX;
var end_clientX;
Page({
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    start: 0,
    dataList: [],
    gid: '',
    status: '',
    resolution: '',
    type: '',
    fir_team: '',
    sec_team: '',
    fir_res: '',
    sec_res: '',
    searchInput: '',
    proBtn: false,
    cheBtn: false,
    pub_pro: false,
    exa_pro: false,
    fir_team_id: '',
    sec_team_id: '',
    oid: "",
    perms: ''
  },
  // 下来加载
  onReachBottom: function() {
    this.lower()
  },
  // 上拉刷新
  onPullDownRefresh() {
    this.refresh();
  },
  refresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var perms_lists = this.data.perms;
    for (var i = 0; i < perms_lists.length; i++) {
      if (perms_lists[i] === '43') {
        this.getData(this);
      }
    }
    setTimeout(function() {

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);
  },
  onShareAppMessage(e) {
    if (e.from === 'button') {
      console.log(e.target)
    }
    return {
      title: '转发'
    }
  },
  onLoad: function(e) {
    let that = this;
    wx.getStorage({
      key: 'perms',
      success: function(res) {
        that.setData({
          perms: res.data
        })
      },
    });
    wx.getStorage({
      key: 'organizations',
      success: function(res) {
        that.setData({
          oid: res.data[0].id,
          _oid: res.data[0].id
        });
      },
    });
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        });
        var perms_lists = that.data.perms;
        for (var i = 0; i < perms_lists.length; i++) {
          if (perms_lists[i] === '43') {
            wx.showLoading({
              title: '加载中',
            })
            that.getData(that);
            wx.hideLoading();
            that.getGroups(that)
          };
          if (perms_lists[i] === '436') {
            that.setData({
              pub_pro: true
            })
          };
          if (perms_lists[i] === '435') {
            that.setData({
              exa_pro: true
            })
          }
        }


        wx.getStorage({
          key: 'root_terminalReslotions',
          success: function(res) {
            that.setData({
              fir_res: that.data.resolution ? that.data.resolution : res.data[0],
              new_fir_res: res.data[0],
              sec_res: res.data[1],
            });


          }
        })


        let arr = that.data.perms
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == "436") {
            that.setData({
              proBtn: true
            })
          };
          if (arr[i] == "435") {
            that.setData({
              cheBtn: true
            })
          }
        }

      },
      fail: function(res) {
        wx.redirectTo({
          url: '../login/login',
        })
      }
    })

  },
  onShow: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID:res.data
        });
        that.getGroups(that)
      },
    })



  },



  filter: util.filter,
  // 遮拦

  hideview: util.hideview,

  upArea: function() {
    wx.navigateTo({
      url: '../area/area',
    })
  },

  upOrag: function() {
    wx.navigateTo({
      url: '../organizations/organizations',
    })
  },

  preview: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../preview/preview?id=' + id,
    })
  },
  pub: function(e) {
    var title = e.currentTarget.dataset.title;
    var pixlh = e.currentTarget.dataset.pixlh;
    var pixlv = e.currentTarget.dataset.pixlv;
    var id = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status;
    if (status == 1) {
      wx.navigateTo({
        url: '../pub/pub?pub=' +
          title + '|' + pixlh + '|' + pixlv + '|' + id,
      })
    } else {
      wx.showToast({
        title: '请选择审核通过的节目',
        icon: 'none'
      })
    }

  },
  exam: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提交审核',
      content: '确定提交审核？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ip.init + '/api/program/sumbmitCheck;JSESSIONID=' + that.data.JSESSIONID,
            method: 'POST',
            data: {
              id: id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              var perms_lists = that.data.perms;
              for (var i = 0; i < perms_lists.length; i++) {
                if (perms_lists[i] === '43') {
                  wx.request({
                    url: ip.init + '/api/program/getProgramList;JSESSIONID=' + that.data.JSESSIONID,
                    method: 'POST',
                    data: {
                      oid: that.data.oid,
                      length: 10,
                      start: that.data.start
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function(res) {
                      if (res.data.code == 2) {
                        wx.redirectTo({
                          url: '../login/login',
                        })
                      }
                      that.setData({
                        dataList: res.data.content.data
                      })
                      // wx.showTabBarRedDot({
                      //   index: 3,
                      // })
                    }
                  })
                }
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  proDetail: function() {
    wx.navigateTo({
      url: '../proDetail/proDetail',
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
        var perms_lists = that.data.perms;
        for (var i = 0; i < perms_lists.length; i++) {
          if (perms_lists[i] === '43') {
            wx.request({
              url: ip.init + '/api/program/getProgramList;JSESSIONID=' + res.data,
              method: 'POST',
              data: {
                oid: that.data.oid,
                length: 10,
                search: that.data.search || '',
                start: that.data.start += 10,
                resolution: that.data.resolution,
                type: that.data.type,
                status: that.data.status,
                gid: that.data.gid,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function(res) {
                that.setData({
                  dataList: that.data.dataList.concat(res.data.content.data)
                })
              }
            })
          }
        }
      }
    })
  },
  scroll: function(e) {},

  tem_res_more: function() {
    wx.navigateTo({
      url: '../tem_res_more/tem_res_more?oid='+this.data.oid,
    })
  },
  pro_more: function() {
    wx.navigateTo({
      url: '../pro_more/pro_more',
    })
  },

  search: function(e) {
    var that = this;
    that.setData({
      search: e.detail.value || ''
    });
    var perms_lists = that.data.perms;
    for (var i = 0; i < perms_lists.length; i++) {
      if (perms_lists[i] === '43') {
        wx.request({
          url: ip.init + '/api/program/getProgramList;JSESSIONID=' + that.data.JSESSIONID,
          // method: 'POST',
          data: {
            oid: that.data.oid,
            search: e.detail.value || '',
            resolution: that.data.resolution,
            type: that.data.type,
            status: that.data.status,
            gid: that.data.gid,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            that.setData({
              dataList: res.data.content.data
            })
          }
        });
      }
    }

  },

  formSubmit: function(e) {
    var that = this;
    this.setData({
      display: "none",
      position: "position:fixed",
      translate: '',
      start: 0
    })
    var perms_lists = that.data.perms;
    for (var i = 0; i < perms_lists.length; i++) {
      if (perms_lists[i] === '43') {
        wx.request({
          url: ip.init + '/api/program/getProgramList;JSESSIONID=' + that.data.JSESSIONID,
          data: {
            oid: that.data.oid,
            resolution: that.data.resolution,
            type: that.data.type,
            status: that.data.status,
            gid: that.data.gid,
            search: that.data.search || ""
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            that.setData({
              dataList: res.data.content.data,

            })
          }
        });
      }
    }
  },
  reset: function() {
    let that = this;
    var perms_lists = that.data.perms;

    this.setData({
      type: '',
      status: '',
      gid: '',
      resolution: '',
      fir_team: this.data.new_fir_team || '',
      fir_res: this.data.new_fir_res,
      fir_team_id: this.data.new_fir_team_id || '',
      hide_fir: '',
      hide_sec: '',
      hideRes_fir: '',
      hideRes_sec: '',
      hideTeam_fir: '',
      hideTeam_sec: '',
      hideSt_fir: "",
      hideSt_sec: "",
      hideSt_thr: '',
      hideSt_fou: "",
      org_name: '',
      oid: this.data._oid
    });
    for (var i = 0; i < perms_lists.length; i++) {
      if (perms_lists[i] === '43') {
        that.getGroups(that)
      }
    }
  },

  bindtapFuncSt_fir: function(e) {
    var that = this;
    that.data.status = e.currentTarget.dataset.text;
    that.setData({
      hideSt_fir: "background-color:#2d95f2; color:#fff;background-size:60rpx; background-image: url('data:image/png;base64,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');",
      hideSt_sec: '',
      hideSt_thr: '',
      hideSt_fou: ''
    })
  },
  bindtapFuncSt_sec: function(e) {
    var that = this;
    that.data.status = e.currentTarget.dataset.text;
    that.setData({
      hideSt_fir: "",
      hideSt_sec: "background-color:#2d95f2; color:#fff; background-size:60rpx; background-image: url('data:image/png;base64,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');",
      hideSt_thr: '',
      hideSt_fou: ''
    })
  },
  bindtapFuncSt_thr: function(e) {
    var that = this;
    that.data.status = e.currentTarget.dataset.text;
    that.setData({
      hideSt_fir: "",
      hideSt_sec: "",
      hideSt_thr: "background-color:#2d95f2; color:#fff; background-size:60rpx;background-image: url('data:image/png;base64,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');",
      hideSt_fou: ''
    })
  },
  bindtapFuncSt_fou: function(e) {
    var that = this;
    that.data.status = e.currentTarget.dataset.text;
    that.setData({
      hideSt_fir: "",
      hideSt_sec: "",
      hideSt_thr: '',
      hideSt_fou: "background-color:#2d95f2; color:#fff;background-size:60rpx; background-image: url('data:image/png;base64,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'); "
    })
  },
  //节目
  bindtapFuncPr_fir: function(e) {
    var that = this;
    that.data.type = e.currentTarget.dataset.text;
    that.setData({
      hide_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      hide_sec: ''
    })
  },
  bindtapFuncPr_sec: function(e) {
    var that = this;
    that.data.type = e.currentTarget.dataset.text;
    that.setData({
      hide_fir: '',
      hide_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
    })
  },
  //分辨率
  resFunc_fir: function(e) {
    var that = this;
    that.data.resolution = e.currentTarget.dataset.text;
    that.setData({
      hideRes_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      hideRes_sec: ''
    })
  },
  resFunc_sec: function(e) {
    var that = this;
    that.data.resolution = e.currentTarget.dataset.text;
    that.setData({
      hideRes_fir: '',
      hideRes_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
    })
  },
  //节目分组
  teamFunc_fir: function(e) {
    var that = this;
    that.data.gid = e.currentTarget.dataset.text;
    that.setData({
      hideTeam_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      hideTeam_sec: '',
    })
  },
  teamFunc_sec: function(e) {
    var that = this;
    that.data.gid = e.currentTarget.dataset.text;
    that.setData({
      hideTeam_fir: '',
      hideTeam_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
    })
  },
  getData: function(that) {
    wx.request({
      url: ip.init + '/api/program/getProgramList;JSESSIONID=' + that.data.JSESSIONID,
      method: 'GET',
      data: {
        oid: that.data.oid,
        length: 10,
        start: 0,
        resolution: that.data.resolution,
        type: that.data.type,
        status: that.data.status,
        gid: that.data.gid,
        search: that.data.searchInput
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.code == 2) {
          wx.redirectTo({
            url: '../login/login',
          })
        }
        that.setData({
          dataList: res.data.content.data,
          start: 0
        })
      }
    });

  },
  getGroups: function(that) {
    wx.request({
      url: ip.init + '/api/program/getProgramGroups;JSESSIONID=' + that.data.JSESSIONID,
      method: 'GET',
      data: {
        oid: that.data.oid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          teamData: res.data.content,
        })
        if (res.data.content.length == 1) {
          that.setData({
            fir_team: res.data.content[0].name ? res.data.content[0].name : '',
            fir_team_id: res.data.content[0].id ? res.data.content[0].id : '',
            new_fir_team_id: res.data.content[0].id ? res.data.content[0].id : '',
            new_fir_team: res.data.content[0].name ? res.data.content[0].name : '',
          })


        } else if (res.data.content.length > 1) {
          that.setData({
            fir_team: res.data.content[0].name ? res.data.content[0].name : '',
            fir_team_id: res.data.content[0].id ? res.data.content[0].id : '',
            new_fir_team_id: res.data.content[0].id ? res.data.content[0].id : '',
            new_fir_team: res.data.content[0].name ? res.data.content[0].name : '',
            sec_team: res.data.content[1].name ? res.data.content[1].name : '',
            sec_team_id: res.data.content[1].id ? res.data.content[1].id : '',
          })
        }

        for (var i = 0; i < res.data.content.length; i++) {
          if (that.data.gid == res.data.content[i].id) {
            that.setData({
              fir_team: res.data.content[i].name,
            })
          }
        }

      }
    });
  }
})