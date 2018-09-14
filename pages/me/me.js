// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  quit:function(){
    wx.navigateBack({
      delta: -1
    })
  },
  pwd:function(){
    wx.navigateTo({
      url: '../password/password',
    })
  },
  about:function(){
    wx.navigateTo({
      url: '../about/about',
    })
  }
})