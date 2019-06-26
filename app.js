//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    this.autoUpdate()
  },
  globalData: {
    userInfo: null
  },
  onShareAppMessage(e) {


  },
  autoUpdate: function() {
    var self = this
    // 获取小程序更新机制兼容
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          } 
        }
      })
    })
    // if (wx.canIUse('getUpdateManager')) {
    //   const updateManager = wx.getUpdateManager()
    //   //1. 检查小程序是否有新版本发布
    //   updateManager.onCheckForUpdate(function(res) {
    //     // 请求完新版本信息的回调
    //     if (res.hasUpdate) {
    //       //检测到新版本，需要更新，给出提示
    //       self.downLoadAndUpdate(updateManager)      
    //     }
    //     // self.downLoadAndUpdate(updateManager)
    //   })
    // } else {
    //   // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    //   })
    // }
  },
  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate: function(updateManager) {
    var self = this
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function() {
      wx.hideLoading()
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      wx.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      })
    })
  }
})