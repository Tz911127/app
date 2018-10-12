// pages/examine/examine.js

var ip = require('../../utils/ip.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
  },

  onShow: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        console.log(res.data);
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
            that.setData({
              dataList: res.data.content.data
            })
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
          success: function(res) {

            that.setData({
              dataMatList: res.data.content.data
            })
          }
        })
      }
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
        console.log(res.data);
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
            that.setData({
              dataList: res.data.content.data
            })
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
        console.log(res.data);
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

            that.setData({
              dataMatList: res.data.content.data
            })
          }
        })
      }
    })

  },
  preview: function(e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var path = e.currentTarget.dataset.path;
    path = encodeURIComponent(path);
    console.log(path)
    wx.navigateTo({
      url: '../exa/exa?id=' + id
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

  }
})