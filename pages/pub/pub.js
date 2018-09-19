// pages/pub/pub.js

var util = require('../../utils/util.js');
Page({

  data: {
    endDate: '永久',
    pubTime: [],
    flag: false
  },
  onLoad: function(options) {
    var time = util.formatTime(new Date());
    var str = options.pub;
    var pub = str.split('|');
    this.setData({
      startDate: time,
      title: pub[0],
      res: pub[1] + '*' + pub[2]
    });
  },
  onShow: function(e) {
    var that = this;
    var pages = getCurrentPages();
    var currPages = pages[pages.length - 1];
    if (currPages.data.timeArray != undefined) {
      that.setData({
        pubTime: that.data.pubTime.concat(currPages.data.timeArray)
      })
    }

    if (that.data.pubTime.length == 3) {
      that.setData({
        flag: true
      });

    }

  },
  bindStartDate: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDate: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  setTime: function() {
    wx.navigateTo({
      url: '../setTime/setTime',
    })
  },
  del: function(e) {
    for (var i = 0; i < this.data.pubTime.length; i++) {
      if (e.currentTarget.dataset.name.id == this.data.pubTime[i].id) {
        this.data.pubTime.splice(i, 1);
      }
    };
    if (this.data.pubTime.length < 3) {
      this.setData({
        flag: false
      });
    }
    this.setData({
      pubTime: this.data.pubTime
    })
  }
})