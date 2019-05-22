//index.js
//获取应用实例
var cityData = require("../../utils/city.js");

var app = getApp()
Page({
  data: {
    // provinces:[],
    // cities : []
  },
  onLoad: function(e) {
    var that = this;
    for (var i in cityData.init) {
      that.setData({
        provinces: cityData.init[86]
        // city: cityData.init[0]
      })
    }
    var pro = []
    for (var i in that.data.provinces) {
      for (var j = 0; j < that.data.provinces[i].length; j++) {
        pro.push(that.data.provinces[i][j])
      }
    };

    that.setData({
      pro: pro
    })
  },

  click: function(e) {
    wx.navigateTo({
      url: '../area_city/area_city?code=' + e.currentTarget.dataset.code + '&name=' + e.currentTarget.dataset.name,
    })
  }

})