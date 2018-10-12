// pages/pub/pub.js

var util = require('../../utils/util.js');
Page({

  data: {
    startDate: '1970-01-01',
    newstartDate: util.formatTime,
    endDate: '2050-01-01',
    pubTime: [],
    flag: false,
    border: 'border: 1px solid #096DD9'
  },
  onLoad: function(options) {
    var time = util.formatTime(new Date());
    var str = options.pub;
    var pub = str.split('|');
    this.setData({

      title: pub[0],
      res: pub[1] + '*' + pub[2],
      proId: pub[3]
    });
  },
  onShow: function(e) {
    var that = this;
    var pages = getCurrentPages();
    var currPages = pages[pages.length - 1];
    // console.log(currPages)
    // that.setData({
    //   pubTime: [],
    // })
    if (currPages.data.timeArray != undefined) {
      // if (currPages.data.timeArray.length > 0) {
        // console.log(currPages.data.timeArray)
        // delete currPages.data.timeArray[0].id;
      // }
      var newPubTime = that.data.pubTime.concat(currPages.data.timeArray);
      that.setData({
        pubTime: newPubTime
      });
      currPages.data.timeArray = []
    }

    if (that.data.pubTime.length == 3) {
      that.setData({
        flag: true,
        border:'border: none'
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
    var that = this;
    // console.log(that.data.pubTime)
    var pubTime = JSON.stringify(that.data.pubTime)
    wx.navigateTo({
      url: '../setTime/setTime?pubTime=' + pubTime ,
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
        flag: false,
        border: 'border: 1px solid #096DD9'
      });
    }
    this.setData({
      pubTime: this.data.pubTime
    })
  },
  choose_tem: function(e) {
    var that = this;
    for (var i = 0; i < this.data.pubTime.length; i++) {
      delete this.data.pubTime[i].id
    }
    if (this.data.pubTime.length == 0) {
      var pubTime = [{
        startTime: "00:00",
        endTime: "24:00",
        weeks: "1,2,3,4,5,6,7"
      }];
      wx.navigateTo({
        url: '../sel_tem/sel_tem?proId=' + this.data.proId + '&pubTime=' + JSON.stringify(pubTime) + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate,

      });
    } else {
      wx.navigateTo({
        url: '../sel_tem/sel_tem?proId=' + this.data.proId + '&pubTime=' + JSON.stringify(this.data.pubTime) + '&startDate=' + this.data.startDate + '&endDate=' + this.data.endDate,

      });
      setTimeout(function() {
        that.setData({
          pubTime: []
        })
      }, 2000)

    }
  },

})