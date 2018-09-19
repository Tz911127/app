// pages/terminal/terminal.js
var ip = require('../../utils/ip.js')
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
    provinceCode: '',
    city_no: ''
  },
  onLoad: function(e) {
    var that = this;
    that.data.tem_fir = that.data.resolution
    console.log(that.data.provinceCode, that.data.city_no)
  },

  onShow: function(e) {
    var that = this;
    var pages = getCurrentPages();
    var currPages = pages[pages.length - 1];
    if (currPages.data.resolution) {
      that.data.tem_fir = that.data.resolution;
    }
    console.log(that.data.provinceCode, that.data.city_no)
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
            oid: 0,
            length: 10,
            start: that.data.start
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

        wx.request({
          url: ip.init + '/api/terminal/getTerminalGroups;JSESSIONID=' + res.data,
          method: 'GET',
          data: {
            oid: 0
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            // console.log(res)
            if (res.data.content.length > 2) {
              that.setData({
                // temList: [res.data.content[0], res.data.content[1]],
                team_fir: res.data.content[0].name,
                team_sec: res.data.content[1].name
              })
            }
          }
        });

        wx.request({
          url: ip.init + '/api/auth/getUserSrc;JSESSIONID=' + res.data,
          method: "GET",
          data: {},
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            if (res.data.content.root_terminalReslotions.length > 2) {
              that.setData({
                tem_fir: res.data.content.root_terminalReslotions[0],
                tem_sec: res.data.content.root_terminalReslotions[1]

              })
            }

          }
        });


      }
    })

  },

  tem_more: function() {
    wx.navigateTo({
      url: '../tem_more/tem_more',
    })
  },

  res_more: function() {
    wx.navigateTo({
      url: '../res_more/res_more',
    })
  },


  filter: function() {
    this.setData({
      display: "block",
      position: "position:fixed",
      translate: 'transform: translateX(-' + this.data.windowWidth * 0.7 + 'px);'
    })

  },
  // 遮拦
  hideview: function() {
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
    })
  },

  upArea: function() {
    wx.navigateTo({
      url: '../area/area',
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

        wx.request({
          url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            oid: 0,
            length: 10,
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
    })
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      // method: 'POST',
      data: {
        oid: 0,
        search: e.detail.value || ''
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
    this.data.op = '';
    this.data.hasProgram = '';
    this.data.status = '';
    this.data.gid = '';
    this.data.resolution = '';
    this.data.provinceCode = '';
    this.data.city_no = ''
  },

  formSubmit: function(e) {
    var that = this;
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
    })
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      data: {
        oid: 0,
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

  bindtapFuncOp: function(e) {
    var that = this;
    that.data.op = e.currentTarget.dataset.text;
  },
  bindtapFuncPro: function(e) {
    var that = this;
    that.data.hasProgram = e.currentTarget.dataset.text;
  },
  bindtapFuncSt: function(e) {
    var that = this;
    that.data.status = e.currentTarget.dataset.text;
  },
  bindtapFuncRe: function(e) {
    var that = this;
    that.data.resolution = e.currentTarget.dataset.text;
  },
  bindtapFuncTe: function(e) {
    var that = this;
    that.data.gid = e.currentTarget.dataset.text.id;
  }
})