var ip = require('../../utils/ip.js')
var util = require('../../utils/util.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var qqmapsdk;
Page({
  data: {
    result: '',
    scale: 13,
    controls: '40',
    covers: [],
    markers: []

  },
  onLoad: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        });
        wx.getStorage({
          key: 'token',
          success: function(res) {
            that.setData({
              token: res.data
            })
          },
        });

        qqmapsdk = new QQMapWX({
          key: 'DFUBZ-FSIC6-P7OS7-MNHFC-IRRKK-L3FJJ'
        });


        wx.getLocation({
          type: 'wgs84',
          success: function(res) {
            // wx.setStorage({
            //   key: 'latitude',
            //   data: res.latitude,
            // });
            // wx.setStorage({
            //   key: 'longitude',
            //   data: res.longitude,
            // });
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
            });
            wx.request({
              url: ip.init + '/api/terminal/getAllTerminalInfoForMap;JSESSIONID=' + that.data.JSESSIONID,
              method: 'POST',
              data: {
                latitude: res.latitude,
                longitude: res.longitude,
                maxDistance: 10000,
                length: 1000
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
            })
          }
        });

      },
      fail: function(res) {
        wx.redirectTo({
          url: '../login/login',
        })
      }
    })

  },
  onShow: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        });
        wx.getLocation({
          success: function(res) {
            wx.request({
              url: ip.init + '/api/terminal/getAllTerminalInfoForMap;JSESSIONID=' + that.data.JSESSIONID,
              method: 'POST',
              data: {
                latitude: res.latitude,
                longitude: res.longitude,
                maxDistance: 10000,
                length: 1000
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function (res) {
                if (res.data.code == 2) {
                  wx.redirectTo({
                    url: '../login/login',
                  })
                }
                // console.log(res.data)
                if (res.data.code == 1) {

                  var statusCount = res.data.content.statusSummary;
                  var tem_covers = res.data.content.terminalList;
                  var tem_cover = {};

                  for (let i = 0; i < statusCount.length; i++) {
                    if (statusCount[i].status == 1) {
                      that.setData({
                        ter_ok: statusCount[i].count
                      })
                    } else if (statusCount[i].status == 2) {
                      that.setData({
                        ter_offline: statusCount[i].count
                      })
                    } else if (statusCount[i].status == 3) {
                      that.setData({
                        ter_error: statusCount[i].count
                      })
                    } else {
                      that.setData({
                        ter_out: statusCount[i].count
                      })
                    }
                  };
                  for (var i = 0; i < tem_covers.length; i++) {
                    tem_cover.latitude = tem_covers[i].p.y;
                    tem_cover.longitude = tem_covers[i].p.x;
                    if (tem_covers[i].status == 1) {
                      tem_cover.iconPath = "../../img/position_icon1@3x.png"
                    } else if (tem_covers[i].status == 2) {
                      tem_cover.iconPath = "../../img/position_icon2@3x.png"
                    } else if (tem_covers[i].status == 3) {
                      tem_cover.iconPath = "../../img/position_icon3@3x.png"
                    } else {
                      tem_cover.iconPath = "../../img/position_icon4@3x.png"
                    };

                    tem_cover.width = '20';
                    tem_cover.height = '25';
                    that.data.markers.push(util.bMapTransQQMap(tem_cover.longitude, tem_cover.latitude, tem_cover.iconPath, tem_cover.width, tem_cover.height))
                  }
                  that.setData({
                    markers: that.data.markers,
                  });

                };

              }
            })
          },
        })
        
      },
    })


  },

  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap');
    var that = this;
  },
  scanCode: function() {
    var that = this
    wx.scanCode({
      success: function(res) {
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
            if (res.data.content) {
              var new_res = res.data.content;
              that.setData({
                reso: new_res.split(',')[2],
                uuid: new_res.split(',')[1]
              });
              wx.navigateTo({
                url: '../scan/scan?reso=' + that.data.reso + '&uuid=' + that.data.uuid + '&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude,
              });
            } else {
              wx.showToast({
                title: '二维码解析失败',
                icon: "none"
              })
            }

          }
        });

      },
      fail: function(res) {}
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
          longitude: res.longitude,
          markers: that.data.markers.concat([{
            latitude: res.latitude,
            longitude: res.longitude,
          }])
        })
      }
    })
  },
  bindregionchange: function(e) {
    if (e.type == 'end') {
      var that = this;
      wx.getStorage({
        key: 'sessionid',
        success: function(res) {
          that.setData({
            JSESSIONID: res.data
          })
        },
      });
      this.mapCtx = wx.createMapContext('myMap');
      this.mapCtx.getCenterLocation({
        success: function(res) {
          wx.request({
            url: ip.init + '/api/terminal/getAllTerminalInfoForMap;JSESSIONID=' + that.data.JSESSIONID,
            method: 'POST',
            data: {
              latitude: res.latitude,
              longitude: res.longitude,
              maxDistance: 10000,
              length: 100
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              var coY = res.data.content.point.y;
              var coX = res.data.content.point.x;
              var covers = [{
                latitude: coY,
                longitude: coX
              }];
              var tem_covers = res.data.content.terminalList;
              var tem_cover = {};
              var coverList = []
              for (var i = 0; i < tem_covers.length; i++) {
                tem_cover.latitude = tem_covers[i].p.y;
                tem_cover.longitude = tem_covers[i].p.x;
                if (tem_covers[i].status == 1) {
                  tem_cover.iconPath = "../../img/position_icon1@3x.png"
                } else if (tem_covers[i].status == 2) {
                  tem_cover.iconPath = "../../img/position_icon2@3x.png"
                } else if (tem_covers[i].status == 3) {
                  tem_cover.iconPath = "../../img/position_icon3@3x.png"
                } else {
                  tem_cover.iconPath = "../../img/position_icon4@3x.png"
                };

                tem_cover.width = '20';
                tem_cover.height = '25';
                coverList.push(util.bMapTransQQMap(tem_cover.longitude, tem_cover.latitude, tem_cover.iconPath, tem_cover.width, tem_cover.height))
              }
              that.setData({
                markers: coverList,
                // covers: covers
              });

            }
          })
        }
      })
    }
  }
})