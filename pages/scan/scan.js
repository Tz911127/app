// pages/scan/scan.js
var util = require('../../utils/util.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var ip = require('../../utils/ip.js')
var qqmapsdk;
var formatLocation = util.formatLocation;
Page({

  data: {
    hasLocation: false,
    token: '',
    locationAddress: '',
    remark: '',
    name: ''
  },
  onLoad: function(e) {
    var that = this;
    that.setData({
      reso: e.reso,
      uuid: e.uuid,
      locationAddress: e.locationAddr,
      longitude: e.longitude,
      latitude: e.latitude,
      license: e.license,
      os:e.os
    })
    console.log(e.os)
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data
        })
      },
    });
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })
      },
    });

    qqmapsdk = new QQMapWX({
      key: 'DFUBZ-FSIC6-P7OS7-MNHFC-IRRKK-L3FJJ'
    });

    wx.getLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          location: formatLocation(res.longitude, res.latitude)
        })
      }
    })





  },

  chooseLocation: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          hasLocation: true,
          locationAddress: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  nameInput: function(e) {
    this.setData({
      name: e.detail.value
    });

  },
  remarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    });

  },
  example: function (e) {
    wx.navigateTo({
      url: '../example/example',
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
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
  ok_btn: function() {
    var that = this;
    var r = util.qqMapTransBMap(that.data.longitude, that.data.latitude);
    var locationAddress = that.data.locationAddress;
    // var locationAddress = '';
    var name = that.data.name;
    if (locationAddress == '') {
      wx.showToast({
        title: '请选择位置/终端名称',
        icon: 'none'
      })
    } else {
      wx.request({
        url: ip.init + '/client/assit/activateTerminal;JSESSIONID=' + that.data.JSESSIONID,
        method: "POST",
        data: {
          token: that.data.token,
          sn: that.data.uuid,
          os: that.data.os,
          name: that.data.name,
          longitude: r.longitude,
          latitude: r.latitude,
          address: locationAddress,
          resolution: that.data.reso,
          license: that.data.license,
          remark: that.data.remark
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
          if (res.data.code == 1) {
            wx.showToast({
              title: '注册成功',
              success: function(e) {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 2000)
              }
            })

          } else if (res.data.code == 0){
            if (locationAddress == 'undefined') {
              wx.showToast({
                title: "请开启定位",
                icon: 'none'
              })
            }else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
              })
            }
          } 


        }
      })
    }

    let tempFilePaths = that.data.tempFilePaths;
    let picName = that.data.picName

    if (picName === 'jsrc') {
      wx.uploadFile({
        url: ip.init + '/api/terminalShare/saveTerminalShare;JSESSIONID=' + that.data.JSESSIONID,
        filePath: tempFilePaths[0],
        name: 'closeShotFile',
        // formData: {
        //   tids: that.data.tids
        // },
      })

    } else if (picName === 'ysrc') {
      wx.uploadFile({
        url: ip.init + '/api/terminalShare/saveTerminalShare;JSESSIONID=' + that.data.JSESSIONID,
        filePath: tempFilePaths[0],
        name: 'longShotFile',
        // formData: {
        //   tids: that.data.tids
        // },
      })
    } else if (picName === 'zsrc') {
      wx.uploadFile({
        url: ip.init + '/api/terminalShare/saveTerminalShare;JSESSIONID=' + that.data.JSESSIONID,
        filePath: tempFilePaths[0],
        name: 'aroundShotFile',
        // formData: {
        //   tids: that.data.tids
        // },
      })
    } else if (picName === 'osrc') {
      wx.uploadFile({
        url: ip.init + '/api/terminalShare/saveTerminalShare;JSESSIONID=' + that.data.JSESSIONID,
        filePath: tempFilePaths[0],
        name: 'otherShotFile',
        // formData: {
        //   tids: that.data.tids
        // },
      })
    }

  }

})