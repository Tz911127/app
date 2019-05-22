// pages/open_add_info/open_add_info.js
var util = require('../../utils/util.js');
var ip = require('../../utils/ip.js');
var base = require('../../utils/base.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ter_array: ['智能电视', '共享纸巾机屏', '公交电子站台', '门禁屏', '洗手间镜面屏', '售货机屏', '人证识别功能机', '医院电视屏', '智能酒柜屏', 'LED显示屏', '饮水机屏', '电梯投影', '人脸识别屏', '电梯电视', '快递柜', '餐厅桌面屏', '自助终端屏', '取票机屏', '车载电视', '落地广告机'],
    ter_index: 0,
    sce_array: ['零售店', '写字楼', '居民楼', '酒店', '餐厅', '医院', '商场', '地铁', '景点', 'KTV', '电影院', '公交车', '市区道路', '高校', '培训机构', '收费站', '火车高铁站'],
    sce_index: 0,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    sharePrice: '',
    tradeArea: '',
    scene: '',
    jsrc: '',
    ysrc: '',
    zsrc: '',
    osrc: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.ctx = wx.createCameraContext();
    let mode;
    if (options.data) {
      let modeEncode = options.data
      let modeDecode = decodeURIComponent(modeEncode)
      mode = JSON.parse(base.decode(modeDecode))
      that.setData({
        share: true,
        data: mode,
        tids: mode.id,
        sharePrice: mode.sharePrice,
        ter_index: that.data.ter_array.indexOf(mode.shareType),
        sce_index: that.data.sce_array.indexOf(mode.scene),
        scene: mode.scene,
        startDate: that.getTime(mode.shareStartDay),
        endDate: that.getTime(mode.shareEndDay),
        startTime: that.getDate(mode.shareStartTime),
        endTime: that.getDate(mode.shareEndTime),
        tradeArea: mode.tradeArea ? mode.tradeArea : ''
      });
      wx.getStorage({
        key: 'sessionid',
        success: function(res) {
          wx.request({
            url: ip.init + '/api/terminal/getTerminalInfo;JSESSIONID=' + res.data,
            method: 'POST',
            data: {
              tid: mode.id,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              that.setData({
                jsrc: res.data.content.closeShot ? res.data.content.closeShot : '',
                ysrc: res.data.content.longShot ? res.data.content.longShot : '',
                zsrc: res.data.content.aroundShot ? res.data.content.aroundShot : '',
                osrc: res.data.content.otherShot ? res.data.content.otherShot : '',
              })
            }
          })
        },
      })

    } else {
      that.setData({
        tids: options.tids,
        share: false
      })
    }




    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 日期时间格式化
  getDate: function(date) {
    var dateStr = JSON.stringify(date);
    var newDate = dateStr.slice(1, 3) + ':' + dateStr.slice(3, 5)
    return newDate;
  },
  getTime: function(time) {
    var timeStr = JSON.stringify(time);
    var newTime = timeStr.slice(0, 4) + '-' + timeStr.slice(4, 6) + '-' + timeStr.slice(6, 8);
    return newTime;
  },

  bindPickerChange_ter: function(e) {
    this.setData({
      ter_index: e.detail.value
    })
  },
  bindPickerChange_sce: function(e) {
    this.setData({
      sce_index: e.detail.value
    })
  },
  bindStartDateChange: function(e) {
    // let value = this.replaceAll(e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDateChange: function(e) {
    // let value = this.replaceAll(e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },
  replaceAll: function(e) {
    let reg = new RegExp("-", "g");
    return e.replace(reg, "")
  },
  replace: function(e) {
    let reg = new RegExp(":", "g");
    return e.replace(reg, "")
  },
  bindStartTimeChange: function(e) {
    let value = e.detail.value.replace(':', '')
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndTimeChange: function(e) {
    let value = e.detail.value.replace(':', '')
    this.setData({
      endTime: e.detail.value
    })
  },
  bindinput: function(e) {
    this.setData({
      sharePrice: e.detail.value
    })
  },
  bindinputArea: function(e) {
    this.setData({
      tradeArea: e.detail.value
    })
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths: tempFilePaths,
          picName: e.currentTarget.dataset.name
        })
        if (e.currentTarget.dataset.name === 'jsrc') {
          that.setData({
            jsrc: res.tempFilePaths[0],
          });

        } else if (e.currentTarget.dataset.name === 'ysrc') {
          that.setData({
            ysrc: res.tempFilePaths[0],
          });
        } else if (e.currentTarget.dataset.name === 'zsrc') {
          that.setData({
            zsrc: res.tempFilePaths[0],
          });
        } else if (e.currentTarget.dataset.name === 'osrc') {
          that.setData({
            osrc: res.tempFilePaths[0],
          });
        }


      },

    })
  },
  example: function(e) {
    wx.navigateTo({
      url: '../example/example',
    })
  },

  open_add_btn: function(e) {
    let that = this;
    let shareStartDay = that.replaceAll(that.data.startDate);
    let shareEndDay = that.replaceAll(that.data.endDate);
    let shareStartTime = that.data.startTime.replace(':', '');
    let shareEndTime = that.data.endTime.replace(':', '');
    let shareType = that.data.ter_array[that.data.ter_index];
    let scene = that.data.sce_array[that.data.sce_index];
    if (shareType === '' || scene === '' || shareStartDay === '' || shareEndDay === '' || that.data.sharePrice === '' || scene === undefined) {
      wx.showToast({
        title: '请将终端填写完整',
        icon: "none"
      });
      return
    }
    wx.request({
      url: ip.init + '/api/terminalShare/saveTerminalShare;JSESSIONID=' + that.data.JSESSIONID,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        tids: that.data.tids,
        share: '1',
        shareType: shareType,
        scene: scene,
        shareStartDay: shareStartDay,
        shareEndDay: shareEndDay,
        shareStartTime: shareStartTime,
        shareEndTime: shareEndTime,
        sharePrice: that.data.sharePrice,
        tradeArea: that.data.tradeArea
      },
      success: function(res) {
        if (res.data.code === 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'none',
            duration: 2000,
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 2
                })
              }, 2000)

            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    });

    let tempFilePaths = that.data.tempFilePaths;
    let picName = that.data.picName

    if (picName === 'jsrc') {
      wx.uploadFile({
        url: ip.init + '/api/terminalShare/saveTerminalShare;JSESSIONID=' + that.data.JSESSIONID,
        filePath: tempFilePaths[0],
        name: 'closeShotFile',
        formData: {
          tids: that.data.tids
        },
      })

    } else if (picName === 'ysrc') {
      wx.uploadFile({
        url: ip.init + '/api/terminalShare/saveTerminalShare;JSESSIONID=' + that.data.JSESSIONID,
        filePath: tempFilePaths[0],
        name: 'longShotFile',
        formData: {
          tids: that.data.tids
        },
      })
    } else if (picName === 'zsrc') {
      wx.uploadFile({
        url: ip.init + '/api/terminalShare/saveTerminalShare;JSESSIONID=' + that.data.JSESSIONID,
        filePath: tempFilePaths[0],
        name: 'aroundShotFile',
        formData: {
          tids: that.data.tids
        },
      })
    } else if (picName === 'osrc') {
      wx.uploadFile({
        url: ip.init + '/api/terminalShare/saveTerminalShare;JSESSIONID=' + that.data.JSESSIONID,
        filePath: tempFilePaths[0],
        name: 'otherShotFile',
        formData: {
          tids: that.data.tids
        },
      })
    }

  }
})