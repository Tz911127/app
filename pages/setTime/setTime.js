// pages/setTime/setTime.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        value: 'Mon',
        name: '周一',
        checked: 'true'
      },
      {
        value: 'Tue',
        name: '周二',
        checked: 'true'
      },
      {
        value: 'Wed',
        name: '周三',
        checked: 'true'
      },
      {
        value: 'Thu',
        name: '周四',
        checked: 'true'
      },
      {
        value: 'Fri',
        name: '周五',
        checked: 'true'
      },
      {
        value: 'Sat',
        name: '周六',
        checked: 'true'
      },
      {
        value: 'Sun',
        name: '周日',
        checked: 'true'
      }
    ],
    week: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
    startTime: '00:00',
    endTime:'23:59'
  },

  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      week: e.detail.value
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

  bindStartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndTimeChange:function(e){
    this.setData({
      endTime: e.detail.value
    })
  },
  btn:function(){
    console.log(this.data.week);
    wx.navigateBack({
      delta: 2
    })
  }
})