// pages/terminal/terminal.js
var ip = require('../../utils/ip.js')
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
    sec_res: ''
  },

  onShow: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/program/getProgramList;JSESSIONID=' + res.data,
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
              dataList: res.data.content.data
            })
          }
        })


        wx.request({
          url: ip.init + '/api/program/getProgramGroups;JSESSIONID=' + res.data,
          method: 'GET',
          data: {
            oid: 0
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            that.setData({
              fir_team: res.data.content[0].name,
              new_fir_team: res.data.content[0].name,
              sec_team: res.data.content[1].name
            })
            for (var i = 0; i < res.data.content.length; i++) {
              if (that.data.gid == res.data.content[i].id) {
                that.setData({
                  fir_team: res.data.content[i].name,
                })
              }
            }

          }
        })

        wx.request({
          url: ip.init + '/api/auth/getUserSrc;JSESSIONID=' + res.data,
          method: 'GET',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            that.setData({
              fir_res: that.data.resolution ? that.data.resolution : res.data.content.root_terminalReslotions[0],
              new_fir_res: res.data.content.root_terminalReslotions[0],
              sec_res: res.data.content.root_terminalReslotions[1]
            });

          }
        })
      }
    })

  },



  filter: function() {
    this.setData({
      display: "block",
      position: "position:fixed",
      translate: 'transform: translateX(-' + this.data.windowWidth * 0.7 + 'px);'
    });


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
  preview: function(e) {
    wx.navigateTo({
      url: '../preview/preview',
    })
  },
  pub: function(e) {
    var title = e.currentTarget.dataset.title;
    var pixlh = e.currentTarget.dataset.pixlh;
    var pixlv = e.currentTarget.dataset.pixlv;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../pub/pub?pub=' + title + '|' + pixlh + '|' + pixlv + '|' + id,
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

        wx.request({
          url: ip.init + '/api/program/getProgramList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            // oid: 0,
            length: 10,
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
    })
  },
  scroll: function(e) {
    // console.log(e)
  },

  tem_res_more: function() {
    wx.navigateTo({
      url: '../tem_res_more/tem_res_more',
    })
  },
  pro_more: function() {
    wx.navigateTo({
      url: '../pro_more/pro_more',
    })
  },

  search: function(e) {
    var that = this;
    console.log(e)
    wx.request({
      url: ip.init + '/api/program/getProgramList;JSESSIONID=' + that.data.JSESSIONID,
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
          dataList: res.data.content.data
        })
      }
    });

  },

  formSubmit: function(e) {
    var that = this;
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
    })
    wx.request({
      url: ip.init + '/api/program/getProgramList;JSESSIONID=' + that.data.JSESSIONID,
      data: {
        oid: 0,
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
  },
  reset: function() {

    this.setData({
      type: '',
      status: '',
      gid: '',
      resolution: '',
      fir_team: this.data.new_fir_team,
      fir_res: this.data.new_fir_res,
    })
  },

  bindtapFuncSt: function(e) {
    var that = this;
    that.data.status = e.currentTarget.dataset.text;
  },
  bindtapFuncPr: function(e) {
    var that = this;
    that.data.type = e.currentTarget.dataset.text;
  }
})