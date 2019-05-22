// pages/open_edit/open_edit.js
var ip = require('../../utils/ip.js')
var scroll = require('../../utils/scroll.js')
var select = require('../../utils/select.js')
var base = require('../../utils/base.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: 0,
    total: 0,
    share: 1,
    search: ''
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
        // wx.request({
        //   url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
        //   method: 'get',
        //   data: {
        //     share: 1,
        //     length: 10,
        //     start: 0
        //   },
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
        //   success: function(res) {
        //     that.setData({
        //       datalist: res.data.content.data
        //     })
        //   }
        // })
        that.getDate()
      },
    })
  },
  getDate: function() {
    let that = this;
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      method: 'get',
      data: {
        share: 1,
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  search: scroll.search,
  scroll: scroll.scroll,
  lower: scroll.lower,

  checkboxChange: select.checkboxChange,
  //全选
  selectall: select.selectall,
  //取消全选
  selectnone: select.selectnone,
  del_ter: function() {
    let that = this;
    if (that.data.tids === '' || that.data.tids === undefined) {
      wx.showToast({
        title: '请选择终端',
        icon: "none"
      })
    } else {
      wx.showModal({
        title: '',
        content: '确认移除选择终端？',
        success: function(res) {
          if (res.confirm) {
            wx.showToast({
              title: '终端移除成功',
              icon: 'none',
              duration: 2000,
              success: function() {

                wx.request({
                  url: ip.init + '/api/terminalShare/saveTerminalShare;JSESSIONID=' + that.data.JSESSIONID,
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  data: {
                    tids: that.data.tids,
                    share: 0
                  },
                  success: function(res) {
                    setTimeout(function() {
                      that.getDate();
                      that.setData({
                        total: 0,
                        tids: ''
                      });
                    }, 2000)

                  }
                })



              }
            })
          }
        }
      })

    }
  },
  edit_ter: function() {
    let that = this;
    if (that.data.tids === '' || that.data.tids === undefined) {
      wx.showToast({
        title: '请选择终端',
        icon: "none"
      })
    } else {
      if (that.data.data.length === 1) {
        let modeStr = JSON.stringify(that.data.data[0]);
        let mode64 = base.encode(modeStr);
        let modeEncode = encodeURIComponent(mode64)
        wx.navigateTo({
          url: '../open_add_info/open_add_info?data=' + modeEncode,
        });
      } else {
        wx.navigateTo({
          url: '../open_add_info/open_add_info?tids=' + that.data.tids,
        });
      }

      wx.setNavigationBarTitle({
        title: '修改开放终端信息'
      })
    }

  }
})