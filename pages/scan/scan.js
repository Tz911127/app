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
    })
    wx.scanCode({
      success: function(res) {
        // that.setData({
        //   result: res.result
        // });
        wx.request({
          url: ip.init + '/client/assit/descryptQR;JSESSIONID=' + that.data.JSESSIONID,
          method: 'POST',
          data: {
            token: that.data.token,
            qr: res.result
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            console.log(res.data.content);
            var new_res = res.data.content;

            console.log(new_res.split(',')[2])
            that.setData({
              reso: new_res.split(',')[2],
              uuid: new_res.split(',')[1]
            })
          }
        })
      },
    });

    qqmapsdk = new QQMapWX({
      key: 'DFUBZ-FSIC6-P7OS7-MNHFC-IRRKK-L3FJJ'
    });


    wx.getLocation({
      success: function(res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(address) {
            console.log(address)
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
  ok_btn: function() {
    var that = this;
    wx.request({
      url: ip.init + '/client/assit/activateTerminal;JSESSIONID=' + that.data.JSESSIONID,
      method: "POST",
      data: {
        token: that.data.token,
        sn: that.data.uuid,
        os: 1,
        name: '',
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        address: that.data.locationAddress,
        resolution: that.data.reso,
        license: '',
        remark: ''
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){

      }
    })
  }

})