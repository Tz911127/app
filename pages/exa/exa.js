// pages/exa_mate/exa_mate.js
var ip = require('../../utils/ip.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
    })
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data,
          url: ip.init + '/TBXEditor/preview_online/index_online.html?pid=' + that.data.id + '&sessionid=' + res.data + '&keepScale=1&autoRotate=1'
        });
        wx.request({
          url: ip.init + '/api/program/getProgramById;JSESSIONID=' + that.data.JSESSIONID,
          method: 'GET',
          data: {
            id: that.data.id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            var path = res.data.content.materials;
            path = JSON.parse(path);
            var paths = [];
            for (var i = 0; i < path.length; i++) {
              paths.push(path[i][0])

            }
            paths = JSON.stringify(paths)

            wx.request({
              url: ip.init + '/api/material/getMaterialMapByPaths;JSESSIONID=' + that.data.JSESSIONID,
              method: 'POST',
              data: {
                paths: paths
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function(res) {
                var pic = []
                for (var i in res.data.content) {
                  pic.push(res.data.content[i])
                };
                that.setData({
                  pic: pic
                })
              }
            })
          }
        })

      }
    });


  },
  scroll: function() {},
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
  exa: function(e) {
    var status = e.currentTarget.dataset.status
    var that = this;
    wx.showModal({
      title: '',
      content: status == 6 ? '确定审核通过' : '审核不通过',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: ip.init + '/api/program/check;JSESSIONID=' + that.data.JSESSIONID,
            method: 'POST',
            data: {
              id: that.data.id,
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
                  setTimeout(function() {
                    wx.navigateBack({
                      delta: 1
                    });
                  }, 2000)
                }
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  preview: function (e) {
    var id = this.data.id;
    wx.navigateTo({
      url: '../preview/preview?id=' + id,
    })
  },
})  