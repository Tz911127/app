// pages/pub/pub.js

var util = require('../../utils/util.js');
Page({

  data: {
    // startDate: util.formatTime(new Date()),
    endDate:'永久'
  },
  onLoad:function(){
    var time = util.formatTime(new Date());  
    this.setData({
      startDate: time
    }); 
  },
  bindStartDate: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDate:function(e){
    this.setData({
      endDate: e.detail.value
    })
  },
  setTime:function(){
    wx.navigateTo({
      url: '../setTime/setTime',
    })
  }
})