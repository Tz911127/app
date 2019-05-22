// pages/treeTest/treeTest.js
Page({
  data: {
    unnormalizedValue: [

    ],
  },
  selThis(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      oid: e.detail.id,
      org_name:e.detail.name,
      hideCity: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
    });
    wx.navigateBack({
      delta: 1
    });
  },
  onLoad() {
    let that = this;

    wx.getStorage({
      key: 'organizations',
      success: function(res) {
        delete res.data[0].pid;
        that.setData({
          name: res.data[0].name,
          unnormalizedValue: res.data
        })
      },
    })
  }
});