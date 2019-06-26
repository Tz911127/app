// pages/sel_tem/sel_tem.js
var ip = require('../../utils/ip.js')
var util = require('../../utils/util.js')
var select = require('../../utils/select.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    start: 0,
    datalist: [],
    total: 0,
    start: 0,
    temList: [],
    op: '',
    hasProgram: '',
    status: '',
    resolution: '',
    gid: '',
    tem_fir: '',
    provinceCode: '',
    city_no: '',
    city_name: '',
    select_all: false,
    searchInput: '',
    tids: '',
    oid: "",
    exceptionStatus:"",
    expired:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var proId = options.proId;
    // delete options.pubTime.id;
    let that = this;
    var pages = getCurrentPages();
    var currPages = pages[pages.length - 1];
    this.setData({
      proId: proId,
      pubTime: options.pubTime,
      startDate: options.startDate,
      endDate: options.endDate,
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
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
          method: 'GET',
          data: {
            oid: that.data.oid,
            length: 50,
            start: that.data.start,
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
    var that = this;
    // var pages = getCurrentPages();
    // var currPages = pages[pages.length - 1];
    this.setData({
      tids: '',
      total: 0,
      start: 0,
      select_all: false
    });
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
                // team_fir: that.data.team_fir ? that.data.team_fir : res.data.content[0].name,
                team_fir: res.data.content[0].name,
                new_team_fir: res.data.content[0].name,
                // team_fir: res.data.content[0].name,
                team_fir_gid: res.data.content[0].id

              });
              if (res.data.content.length > 1) {
                that.setData({
                  team_sec: res.data.content[1].name,
                  team_sec_gid: res.data.content[1].id
                })
              } else {
                that.setData({
                  team_sec: "",
                  team_sec_gid: ""
                })
              }
            }
          }
        });
      },
    })


  },


  checkboxChange: function(e) {
    var that = this;
    if (e.detail.value.length == that.data.datalist.length) {
      this.setData({
        select_all: true
      })
    } else {
      this.setData({
        select_all: false
      })
    }
    var str = '';
    let arr = that.data.datalist;
    let arr2 = [];

    for (var i = 0; i < arr.length; i++) {
      arr[i].checked = false;
      for (var j = 0; j < e.detail.value.length; j++) {
        if (arr[i].id == e.detail.value[j]) {
          arr[i].checked = true;
          break
        }
      }
    }

    for (var i = 0; i < e.detail.value.length; i++) {
      str += (e.detail.value[i] + ',');
    }

    that.setData({
      total: e.detail.value.length,
      tids: str,
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
          url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            oid: that.data.oid,
            length: 50,
            search: that.data.search || '',
            start: that.data.start += 50,
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
    })
  },
  scroll: function(e) {},
  pub: function(e) {
    var that = this;
    wx.request({
      url: ip.init + '/api/program/programManage_sendCommand;JSESSIONID=' + that.data.JSESSIONID,
      method: "POST",
      data: {
        pid: that.data.proId,
        tids: that.data.tids,
        startDate: util.rep(that.data.startDate),
        endDate: util.rep(that.data.endDate),
        type: 1,
        periodArray: that.data.pubTime

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        if (res.data.code === 1) {
          wx.showToast({
            title: '节目下发操作成功',
            icon: 'none',
            duration: 2000,
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 2
                })
              }, 2000)

            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })

  },
  filter: util.filter,
  // 遮拦
  hideview: util.hideview,
  formSubmit: function(e) {
    var that = this;
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
      total: 0,
      select_all: false,
      start: 0
    })
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      data: {
        search: that.data.search || '',
        oid: that.data.oid,
        resolution: that.data.resolution,
        op: that.data.op,
        hasProgram: that.data.hasProgram,
        status: that.data.status,
        gid: that.data.gid,
        provinceCode: that.data.provinceCode,
        city_no: that.data.city_no,
        length: 50,
        exceptionStatus: that.data.exceptionStatus,
        expired: that.data.expired
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.setData({
          datalist: res.data.content.data,
          tids: ''
        })
      }
    });
  },
  upOrag: function() {
    wx.navigateTo({
      url: '../organizations/organizations',
    })
  },
  bindtapFuncOp_fir: select.bindtapFuncOp_fir,
  // bindtapFuncOp_sec: select.bindtapFuncRe_sec,
  bindtapFuncOp_sec: function(e) {
    var that = this;
    that.data.op = e.currentTarget.dataset.text;
    that.setData({
      opHide_fir: '',
      opHide_sec: 'background:#096dd9;color:#fff'
    })
  },
  //节目
  bindtapFuncPro_fir: function(e) {
    var that = this;
    that.data.hasProgram = e.currentTarget.dataset.text;
    that.setData({
      proHide_fir: 'background:#096dd9;color:#fff',
      proHide_sec: ''
    })
  },
  bindtapFuncPro_sec: function(e) {
    var that = this;
    that.data.hasProgram = e.currentTarget.dataset.text;
    that.setData({
      proHide_fir: '',
      proHide_sec: 'background:#096dd9;color:#fff'
    })
  },
  //状态

  bindtapLine: select.bindtapLine,
  bindtapExpired: select.bindtapExpired,
  bindtapExc: select.bindtapExc,

  //分辨率
  bindtapFuncRe_fir: select.bindtapFuncRe_fir,
  bindtapFuncRe_sec: select.bindtapFuncRe_sec,
  //分组
  bindtapFuncTe_fir: function(e) {
    var that = this;
    // that.data.gid = e.currentTarget.dataset.text.id;
    that.setData({
      teHide_fir: "background:#096dd9;color:#fff",
      teHide_sec: '',
      gid: that.data.team_fir_gid
    })
  },
  bindtapFuncTe_sec: function(e) {
    var that = this;
    that.data.gid = e.currentTarget.dataset.text.id;
    that.setData({
      teHide_fir: "",
      teHide_sec: 'background:#096dd9;color:#fff',
      gid: that.data.team_sec_gid
    })
  },

  search: function(e) {
    var that = this;
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
      search: e.detail.value || ''
    })
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      // method: 'POST',
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

  },
  reset: function() {
    var that = this;
    that.setData({
      op: '',
      hasProgram: '',
      status: '',
      gid: '',
      resolution: '',
      provinceCode: '',
      city_no: '',
      tem_fir: that.data.new_tem_fir,
      tem_sec: that.data.new_tem_sec,
      hide_fir: '',
      hide_sec: '',
      opHide_fir: '',
      opHide_sec: '',
      proHide_fir: '',
      proHide_sec: '',
      hideSt_fir: "",
      hideSt_sec: "",
      hideSt_thr: "",
      hideSt_fou: "",
      city_name: "",
      teHide_fir: '',
      teHide_sec: '',
      oid: that.data._oid,
      org_name: '',
      team_fir: that.data.new_team_fir,
      online: '',
      offline: "",
      onexpired: "",
      offexpired: "",
      onexception: "",
      offexception: "",
      expired: "",
      exceptionStatus: '',

    });
    wx.request({
      url: ip.init + '/api/terminal/getTerminalGroups;JSESSIONID=' + that.data.JSESSIONID,
      method: 'GET',
      data: {
        oid: that.data._oid
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
    });

  },
  res_more: function() {
    wx.navigateTo({
      url: '../res_more/res_more',
    })
  },
  tem_more: function() {
    wx.navigateTo({
      url: '../tem_more/tem_more?oid=' + this.data.oid,
    })
  },
  upArea: function() {
    wx.navigateTo({
      url: '../area/area',
    })
  },
  //全选


  selectall: select.selectall,
  //取消全选

  selectnone: select.selectnone

})