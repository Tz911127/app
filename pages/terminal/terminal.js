// pages/terminal/terminal.js
var ip = require('../../utils/ip.js')
var util = require('../../utils/util.js')
var select = require('../../utils/select.js')
var start_clientX;
var end_clientX;
Page({
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    datalist: [],
    start: 0,
    temList: [],
    op: '',
    hasProgram: '',
    status: '',
    resolution: '',
    gid: '',
    tem_fir: '',
    tem_sec: '',
    provinceCode: '',
    city_no: '',
    city_name: '',
    searchInput: '',
    team_fir: '',
    oid: "",
    open_icon: false,
    groups: '',
    exceptionStatus:"",
    expired:""
  },


  onLoad: function(e) {
    var that = this;
    wx.getStorage({
      key: 'perms',
      success: function(res) {
        that.setData({
          perms: res.data
        })
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i] === '9') {
            that.setData({
              open_icon: true
            })
          }
        }
      },
    });
    wx.getStorage({
      key: 'organizations',
      success: function(res) {
        that.setData({
          oid: res.data[0].id,
          _oid: res.data[0].id
        });
      }

    });

    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        });

        var perms_lists = that.data.perms;
        for (var i = 0; i < perms_lists.length; i++) {

          if (perms_lists[i] === '21') {
            wx.showLoading({
              title: '加载中',
            })
            that.getData(that);
            wx.hideLoading();
            that.getGroups(that)

          }
        };

      },
      fail: function(res) {
        wx.redirectTo({
          url: '../login/login',
        })
      }

    });

    // 监测手机型号
    wx.getSystemInfo({
      success: function(res) {
        if (res.platform == "devtools") {           
          console.log('PC')
        } else if (res.platform == "ios") {
          console.log('IOS')
        } else if (res.platform == "android") {            
          console.log('android')
        }
      },
    })

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
    var pages = getCurrentPages();
    var currPages = pages[pages.length - 1];
    // that.setData({
    //   searchInput: '',
    //   search: ''
    // })

    wx.getStorage({
      key: 'root_terminalReslotions',
      success: function(res) {
        if (res.data.length > 0) {
          that.setData({
            tem_fir: currPages.data.resolution ? currPages.data.resolution : res.data[0],
            new_tem_fir: res.data[0],

          });
          if (res.data.length > 1) {
            that.setData({
              tem_sec: res.data[1],
              new_tem_sec: res.data[1]

            });
          }
        }
      },
    })

    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
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
              groups: res.data.content
            })
            if (res.data.content.length > 0) {
              that.setData({
                team_fir: res.data.content[0].name,
                new_team_fir: res.data.content[0].name,
                team_fir_gid: res.data.content[0].id
              })
              if (res.data.content.length > 1) {
                that.setData({
                  team_sec: res.data.content[1].name,
                  team_sec_gid: res.data.content[1].id
                })
              } else {
                that.setData({
                  team_sec: '',
                  team_sec_gid: ''
                })
              }
            }
          }
        })
      }
    })
  },

  onShareAppMessage(e) {
    if (e.from === 'button') {
      console.log(e.target)
    }
    return {
      title: '转发'
    }
  },

  tem_more: function() {
    wx.navigateTo({
      url: '../tem_more/tem_more?oid=' + this.data.oid,
    })
  },

  res_more: function() {
    wx.navigateTo({
      url: '../res_more/res_more',
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
  detail: function() {
    wx.navigateTo({
      url: '../detail/detail',
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

          if (perms_lists[i] === '21') {
            wx.request({
              url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
              method: 'POST',
              data: {
                oid: that.data.oid,
                length: 10,
                search: that.data.search || '',
                start: that.data.start += 10,
                resolution: that.data.resolution,
                op: that.data.op,
                hasProgram: that.data.hasProgram,
                status: that.data.status,
                gid: that.data.gid,
                provinceCode: that.data.provinceCode,
                city_no: that.data.city_no,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function(res) {
                that.setData({
                  datalist: that.data.datalist.concat(res.data.content.data),
                });
              }
            })
          }
        }
      }
    })
  },
  scroll: function(e) {
    // console.log(e)
  },

  search: function(e) {
    var that = this;
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
      search: e.detail.value || ''
    });
    var perms_lists = that.data.perms;
    for (var i = 0; i < perms_lists.length; i++) {

      if (perms_lists[i] === '21') {
        wx.request({
          url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
          method: 'GET',
          data: {
            oid: that.data.oid,
            search: e.detail.value || '',
            resolution: that.data.resolution,
            op: that.data.op,
            hasProgram: that.data.hasProgram,
            status: that.data.status,
            gid: that.data.gid,
            provinceCode: that.data.provinceCode,
            city_no: that.data.city_no
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
      }
    }

  },
  reset: function() {
    var that = this;
    var perms_lists = that.data.perms;

    that.setData({
      start: 0,
      op: '',
      hasProgram: '',
      status: '',
      gid: '',
      resolution: '',
      provinceCode: '',
      city_no: '',
      expired:"",
      exceptionStatus:'',
      tem_fir: that.data.new_tem_fir || '',
      tem_sec: that.data.new_tem_sec || '',
      team_fir: that.data.new_team_fir || '',
      hide_fir: '',
      hide_sec: '',
      opHide_fir: '',
      opHide_sec: '',
      proHide_fir: '',
      proHide_sec: '',
      city_name: "",
      search: "",
      searchInput: "",
      teHide_fir: '',
      teHide_sec: '',
      org_name: '',
      oid: that.data._oid || '',
      groups: that.data.groups,
      online: '',
      offline: "",
      onexpired: "",
      offexpired: "",
      onexception: "",
      offexception: ""
    });
    for (var i = 0; i < perms_lists.length; i++) {

      if (perms_lists[i] === '21') {
        that.getGroups(that)
      }
    }
  },

  formSubmit: function(e) {
    var that = this;
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
      start: 0
    })
    var perms_lists = that.data.perms;
    for (var i = 0; i < perms_lists.length; i++) {

      if (perms_lists[i] === '21') {
        wx.request({
          url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
          data: {
            oid: that.data.oid,
            search: that.data.search || '',
            resolution: that.data.resolution,
            op: that.data.op,
            hasProgram: that.data.hasProgram,
            status: that.data.status,
            gid: that.data.gid,
            provinceCode: that.data.provinceCode,
            city_no: that.data.city_no,
            exceptionStatus: that.data.exceptionStatus,
            expired: that.data.expired

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
      }
    }
  },
  //系统
  bindtapFuncOp_fir: function(e) {
    var that = this;
    that.data.op = e.currentTarget.dataset.text;
    that.setData({
      opHide_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      opHide_sec: ''
    })
  },
  bindtapFuncOp_sec: function(e) {
    var that = this;
    that.data.op = e.currentTarget.dataset.text;
    that.setData({
      opHide_fir: '',
      opHide_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
    })
  },

  //节目
  bindtapFuncPro_fir: function(e) {
    var that = this;
    that.data.hasProgram = e.currentTarget.dataset.text;
    that.setData({
      proHide_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      proHide_sec: ''
    })
  },
  bindtapFuncPro_sec: function(e) {
    var that = this;
    that.data.hasProgram = e.currentTarget.dataset.text;
    that.setData({
      proHide_fir: '',
      proHide_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
    })
  },
  //状态
  // bindtapLine: function(e) {
  //   let t = e.currentTarget.dataset.text;
  //   var that = this;
  //   that.data.status = e.currentTarget.dataset.text;
  //   if (t == 1) {
  //     that.setData({
  //       offline: '',
  //       online: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
  //     })
  //   } else {
  //     that.setData({
  //       online: '',
  //       offline: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
  //     })
  //   }
  // },
  // bindtapExpired: function(e) {
  //   let t = e.currentTarget.dataset.text;
  //   var that = this;
  //   that.data.expired = e.currentTarget.dataset.text;
  //   if (t == 0) {
  //     that.setData({
  //       offexpired: '',
  //       onexpired: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
  //     })
  //   } else {
  //     that.setData({
  //       onexpired: '',
  //       offexpired: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
  //     })
  //   }

  // },
  // bindtapExc: function(e) {
  //   let t = e.currentTarget.dataset.text;
  //   var that = this;
  //   that.data.exceptionStatus = e.currentTarget.dataset.text;
  //   if (t == 0) {
  //     that.setData({
  //       offexception: '',
  //       onexception: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
  //     })
  //   } else {
  //     that.setData({
  //       onexception: '',
  //       offexception: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
  //     })
  //   }
  // },


  bindtapLine: select.bindtapLine,
  bindtapExpired: select.bindtapExpired,
  bindtapExc: select.bindtapExc,
  //分辨率
  bindtapFuncRe_fir: function(e) {
    var that = this;
    that.data.resolution = e.currentTarget.dataset.text;
    that.setData({
      hide_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      hide_sec: ''
    })
  },
  bindtapFuncRe_sec: function(e) {
    var that = this;
    that.data.resolution = e.currentTarget.dataset.text;
    that.setData({
      hide_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      hide_fir: ''
    })
  },
  //分组
  bindtapFuncTe_fir: function(e) {
    var that = this;
    // that.data.gid = e.currentTarget.dataset.text.id;
    that.setData({
      teHide_fir: "background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff",
      teHide_sec: '',
      gid: that.data.team_fir_gid
    })
  },
  bindtapFuncTe_sec: function(e) {
    var that = this;
    // that.data.gid = e.currentTarget.dataset.text.id;
    that.setData({
      teHide_fir: "",
      teHide_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      gid: that.data.team_sec_gid
    })
  },
  open_ter: function() {
    wx.navigateTo({
      url: '../open_ter/open_ter',
    })
  },
  getData: function(that) {
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      method: 'GET',
      data: {
        oid: that.data.oid,
        length: 10,
        start: 0,
        search: that.data.searchInput,
        resolution: that.data.resolution,
        op: that.data.op,
        hasProgram: that.data.hasProgram,
        status: that.data.status,
        gid: that.data.gid,
        provinceCode: that.data.provinceCode,
        city_no: that.data.city_no
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
          datalist: res.data.content.data,
          bg: 'background:red',
          start: 0
        });

      }
    });
  },
  getGroups: function(that) {
    wx.request({
      url: ip.init + '/api/terminal/getTerminalGroups;JSESSIONID=' + that.data.JSESSIONID,
      method: 'GET',
      data: {
        oid: that.data.oid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            groups: res.data.content
          })
          if (res.data.content.length > 0) {
            that.setData({
              // team_fir: that.data.team_fir ? that.data.team_fir : res.data.content[0].name,
              team_fir: res.data.content[0].name,
              new_team_fir: res.data.content[0].name,
              team_fir_gid: res.data.content[0].id
            })
            if (res.data.content.length > 1) {
              that.setData({
                team_sec: res.data.content[1].name,
                team_sec_gid: res.data.content[1].id
              })
            }
          }
        }
      }
    });
  },
  // 下拉加载
  onReachBottom: function() {
    console.log("xialai");
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
      if (perms_lists[i] === '21') {
        this.getData(this);
      }
    }
    setTimeout(function() {

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);
  },
})