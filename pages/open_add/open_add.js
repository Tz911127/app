// pages/open_add/open_add.js
var ip = require('../../utils/ip.js')
var util = require('../../utils/util.js')
var select = require('../../utils/select.js')
var scroll = require('../../utils/scroll.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    url: '',
    start: 0,
    tem_fir: '',
    tem_sec: '',
    search: '',
    resolution: '',
    status: '',
    provinceCode: '',
    city_no: '',
    op: '',
    share:0,
    total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        });
        wx.request({
          url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
          method: 'get',
          data: {
            share: 0,
            length: 10,
            start: 0
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            that.setData({
              datalist: res.data.content.data
            })
          }
        })
      },
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
    let that = this;
    var pages = getCurrentPages();
    var currPages = pages[pages.length - 1];
    //分辨率
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
      start: 0
    })
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

  scroll: scroll.scroll,
  lower: scroll.lower,


  checkboxChange: select.checkboxChange,

  //全选
  selectall: select.selectall,
  //取消全选

  selectnone: select.selectnone,
  /*search: function(e) {
    var that = this;

    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      data: {
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

  },*/
  search: scroll.search,
  bindtapFuncSt_fir: select.bindtapFuncSt_fir,
  bindtapFuncSt_sec: select.bindtapFuncSt_sec,
  bindtapFuncSt_thr: select.bindtapFuncSt_thr,
  bindtapFuncSt_fou: select.bindtapFuncSt_fou,
  bindtapFuncRe_fir: select.bindtapFuncRe_fir,
  bindtapFuncRe_sec: select.bindtapFuncRe_sec,
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

  res_more: function() {
    wx.navigateTo({
      url: '../res_more/res_more',
    })
  },
  upArea: function() {
    wx.navigateTo({
      url: '../area/area',
    })
  },
  reset: function() {
    let that = this;
    that.setData({
      hideSt_fir: "",
      hideSt_sec: "",
      hideSt_thr: "",
      hideSt_fou: "",
      tem_fir: that.data.new_tem_fir,
      tem_sec: that.data.new_tem_sec,
      opHide_fir: '',
      opHide_sec: '',
      hide_sec: '',
      hide_fir: '',
      hideCity: '',
      city_name: "",
      resolution: '',
      status: '',
      provinceCode: '',
      city_no: '',
      op: ''
    })
  },
  formSubmit: function(e) {
    var that = this;
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
      start: 0
    })
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      data: {
        // oid: that.data.oid,
        search: that.data.search || '',
        resolution: that.data.resolution,
        op: that.data.op,
        // hasProgram: that.data.hasProgram,
        status: that.data.status,
        // gid: that.data.gid,
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

  pub: function(e) {
    let that = this;
    if (that.data.tids === '' || that.data.tids === undefined) {
      wx.showToast({
        title: '请选择终端',
        icon: "none"
      })
    } else {
      wx.navigateTo({
        url: '../open_add_info/open_add_info?tids=' + that.data.tids,
      });
    }

  }

})