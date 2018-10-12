// pages/scan/scan.js
var util = require('../../utils/util.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var ip = require('../../utils/ip.js')
var qqmapsdk;
var formatLocation = util.formatLocation
Page({

  data: {
    hasLocation: false,
    token: ''
  },
  onLoad: function(e) {
    var that = this;
    console.log(e)
    that.setData({
      reso: e.reso,
      uuid: e.uuid,
      latitude: e.latitude,
      longitude: e.longitude
    })
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
    // wx.getStorage({
    //   key: 'latitude',
    //   success: function(res) {
    //     that.setData({
    //       latitude: res.data
    //     })
    //   },
    // });
    // wx.getStorage({
    //   key: 'longitude',
    //   success: function(res) {
    //     that.setData({
    //       longitude: res.data
    //     })
    //   },
    // })

    qqmapsdk = new QQMapWX({
      key: 'DFUBZ-FSIC6-P7OS7-MNHFC-IRRKK-L3FJJ'
    });


    wx.getLocation({
      success: function(res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: that.data.latitude,
            longitude: that.data.longitude
          },
          success: function(address) {
            that.setData({
              locationAddress: address.result.address,
              latitude: address.result.location.lat,
              longitude: address.result.location.lng
            })
          }
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
  ok_btn: function() {
    var that = this;
    var r = util.qqMapTransBMap(that.data.longitude, that.data.latitude);
    var locationAddress = that.data.locationAddress;
    if (locationAddress == '') {
      wx.showToast({
        title: '请选择位置',
        icon: 'none'
      })
    } else {
      wx.request({
        url: ip.init + '/client/assit/activateTerminal;JSESSIONID=' + that.data.JSESSIONID,
        method: "POST",
        data: {
          token: that.data.token,
          sn: that.data.uuid,
          os: 1,
          name: that.data.name,
          longitude: r.longitude,
          latitude: r.latitude,
          address: locationAddress,
          resolution: that.data.reso,
          license: '',
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

          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }


        }
      })
    }

  }

})