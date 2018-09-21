// pages/pub/pub.js

var util = require('../../utils/util.js');
Page({

  data: {
    endDate: '2050-01-01',
    pubTime: [
    //   {
    //   startTime: '00:00',
    //   endTime: "23:59",
    //   weeks: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    // }
    ],
    flag: false
  },
  onLoad: function(options) {
    var time = util.formatTime(new Date());
    var str = options.pub;
    var pub = str.split('|');
    this.setData({
      startDate: time,
      title: pub[0],
      res: pub[1] + '*' + pub[2],
      proId: pub[3]
    });
  },
  onShow: function(e) {
    var that = this;
    var pages = getCurrentPages();
    var currPages = pages[pages.length - 1];
    console.log(currPages)
    if (currPages.data.timeArray != undefined) {
      var newPubTime = that.data.pubTime.concat(currPages.data.timeArray);
      that.setData({
        pubTime: newPubTime
      });
      currPages.data.timeArray = []
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
  },
  choose_tem: function(e) {
    console.log(this.data.pubTime)
    wx.navigateTo({
      url: '../sel_tem/sel_tem?proId=' + this.data.proId + '&pubTime=' + JSON.stringify(this.data.pubTime) + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate,

    })
 
  }
})