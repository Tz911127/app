// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onShow:function(e){
    var that = this;
    wx.getStorage({
      key: 'account',
      success: function (res) {
        that.setData({
          account: res.data
        })
      },
    })
  },

  quit:function(){
    wx.showModal({
      title: '',
      content: '确定退出？',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../login/login',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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