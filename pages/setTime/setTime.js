// pages/setTime/setTime.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        value: '周一',
        name: '周一',
        checked: 'true'
      },
      {
        value: '周二',
        name: '周二',
        checked: 'true'
      },
      {
        value: '周三',
        name: '周三',
        checked: 'true'
      },
      {
        value: '周四',
        name: '周四',
        checked: 'true'
      },
      {
        value: '周五',
        name: '周五',
        checked: 'true'
      },
      {
        value: '周六',
        name: '周六',
        checked: 'true'
      },
      {
        value: '周日',
        name: '周日',
        checked: 'true'
      }
    ],
    weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    startTime: '00:00',
    endTime: '23:59'
  },
  onLoad: function(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      timeArray: []
    });
  },
  checkboxChange: function(e) {
    this.setData({
      weeks: e.detail.value
    })
    var items = this.data.items,
      values = e.detail.value;
    for (var i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value == values[j]) {
          items[i].checked = true;
          break
        }
      }
    }

    this.setData({
      items: items
    })
  },

  bindStartTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  submit: function(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    var timeArray = [];
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var timeArr = {
      id: timestamp,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      weeks: util.format(this.data.weeks)
    }
    timeArray.push(timeArr);
    prevPage.setData({
      timeArray: timeArray
    });
    wx.navigateBack({
      delta: 1
    });
  }
})