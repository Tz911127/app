var ip = require('../../utils/ip.js')
Page({
  data: {
    result: ''
  },
  onShow: function(e) {
    var that = this;
    wx.getLocation({
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            name: res.name,
            desc: res.address
          }]
        })
      }
    });
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        console.log(res.data);
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/terminal/getAllTerminalInfoForMap;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            oid: 0,
            length: 10,
            start: 0
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            console.log(res.data.content);
            var dataList = res.data.content;
            var ter_ok = [];
            var ter_offline = [];
            var ter_error = [];
            var ter_out = [];
            for (var i in dataList) {
              for (var j = 0; j < dataList[i].length; j++) {
                if (dataList[i][j].status == 1) {
                  that.setData({
                    ter_ok: ter_ok.push(dataList[i][j])
                  });
                } else if (dataList[i][j].status == 2) {
                  that.setData({
                    ter_offline: ter_offline.push(dataList[i][j])
                  });
                } else if (dataList[i][j].status == 3) {
                  that.setData({
                    ter_error: ter_error.push(dataList[i][j])
                  });
                } else if (dataList[i][j].status == 4) {
                  that.setData({
                    ter_out: ter_out.push(dataList[i][j])
                  });
                }
              }
            }
            console.log(ter_out.length, ter_error.length, ter_offline.length, ter_ok.length);
            that.setData({
              ter_ok_num: ter_ok.length,
              ter_offline_num:ter_offline.length,
              ter_error_num:ter_error.length,
              ter_out_num:ter_out.length
            })
          }
        })
      }
    })

  },
  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap');
  },
  // getCenterLocation: function() {
  //   this.mapCtx.getCenterLocation({
  //     success: function(res) {
  //       console.log(res.longitude)
  //       console.log(res.latitude)
  //     }
  //   })
  // },
  // moveToLocation: function() {
  //   this.mapCtx.moveToLocation();
  //   console.log(this.mapCtx.moveToLocation())
  // },
  // translateMarker: function() {
  //   this.mapCtx.translateMarker({
  //     markerId: 1,
  //     autoRotate: true,
  //     duration: 1000,
  //     destination: {
  //       latitude: 23.10229,
  //       longitude: 113.3345211,
  //     },
  //     animationEnd() {
  //       console.log('animation end')
  //     }
  //   })
  // },
  // includePoints: function() {
  //   this.mapCtx.includePoints({
  //     padding: [10],
  //     points: [{
  //       latitude: 23.10229,
  //       longitude: 113.3345211,
  //     }, {
  //       latitude: 23.00229,
  //       longitude: 113.3345211,
  //     }]
  //   })
  // },
  scanCode: function() {
    wx.navigateTo({
      url: '../scan/scan',
    });

  },
  chooseLocation: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          hasLocation: true,
          locationAddress: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            name: res.name,
            desc: res.address
          }]
        })
      }
    })
  },
})