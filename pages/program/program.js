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
    type: ''
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
  preview: function() {
    wx.navigateTo({
      url: '../preview/preview',
    })
  },
  pub: function(e) {
    console.log(e)
    var title = e.currentTarget.dataset.title;
    var pixlh = e.currentTarget.dataset.pixlh;
    var pixlv = e.currentTarget.dataset.pixlv
    wx.navigateTo({
      url: '../pub/pub?pub=' + title + '|' + pixlh + '|' + pixlv,
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

  tem_res_more:function(){
    wx.navigateTo({
      url: '../tem_res_more/tem_res_more',
    })
  },
  pro_more:function(){
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
    this.data.type = '';
    this.data.status = '';
    this.data.gid = '';
    this.data.resolution = ''
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