// pages/treeTest/treeTest.js
var ip = require('../../utils/ip.js')
Page({
  data: {
    unnormalizedValue: [],
  },
  onLoad() {
    let that = this;

    wx.getStorage({
      key: 'organizations',
      success: function (res) {
        delete res.data[0].pid;
        that.setData({
          name: res.data[0].name,
          unnormalizedValue: res.data
        })
      },
    });
    wx.getStorage({
      key: "sessionid",
      success: function (res) {
        that.setData({
          JSESSIONID: res.data
        })
      }
    })
  },
  selThis(e) {
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];

    prevPage.setData({
      oid: e.detail.id,
      org_name: e.detail.name,
      hideCity: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
    });
    wx.navigateBack({
      delta: 1
    });
  },
  
});