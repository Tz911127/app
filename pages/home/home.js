var ip = require('../../utils/ip.js')
var util = require('../../utils/util.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var wxCharts = require('../../utils/wxchart.js')
var pieChart = null;
var qqmapsdk;

Page({
  data: {
    result: '',
    series: [],
    background: ['http://cdn-public.q-media.cn/html/f13c19bc5343c08f1e8c2970db11328.png'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,

    interval: 2000,
    duration: 500,

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
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
            });

            qqmapsdk.reverseGeocoder({
              location: {
                latitude: that.data.latitude,
                longitude: that.data.longitude
              },
              success: function(address) {
                that.setData({
                  locationAddr: address.result.address,
                })
              }
            });

          }
        });


        wx.request({
          url: ip.init + '/api/auth/getUserSrc;JSESSIONID=' + that.data.JSESSIONID,
          method: 'GET',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            // if (res.data.content.current_perms) {
            let arr = res.data.content.current_perms.split(',');
            wx.setStorage({
              key: 'perms',
              data: arr
            });
            wx.setStorage({
              key: 'domainName',
              data: res.data.content.domainName,
            });
            wx.setStorage({
              key: 'organizations',
              data: res.data.content.root_organizations,
            });
            wx.setStorage({
              key: 'root_terminalReslotions',
              data: res.data.content.root_terminalReslotions,
            });
            wx.setStorage({
              key: 'root_programReslotions',
              data: res.data.content.root_programReslotions,
            });
          }
        });




      },
      fail: function(res) {
        wx.redirectTo({
          url: '../login/login',
        })
      },

    });



  },
  onShow: function(e) {
    var that = this;
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
          success: function(res) {
            if (res.data.code == 2) {
              console.log(13)
              wx.redirectTo({
                url: '../login/login',
              })
            }
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
              var windowWidth = 320;
              var windowHeight = 300;
              try {
                var res = wx.getSystemInfoSync();
                windowWidth = res.windowWidth;
                windowHeight = res.windowHeight;
              } catch (e) {
                console.error('getSystemInfoSync failed!');
              }
              let series = [{
                  name: '离线',
                  data: that.data.ter_offline,
                  color: '#98A0B3'
                },
                //  {
                //   name: '异常',
                //   data: that.data.ter_error,
                //   color: '#f7b500'
                // },
                //  {
                //   name: '到期',
                //   data: that.data.ter_out,
                //   color: '#f72000'
                // }, 
                {
                  name: '在线',
                  data: that.data.ter_ok,
                  color: '#1174fd'
                }
              ];
              // for (let i = 0; i < series.length - 1; i++) {
              //   for (let j = 0; j < series.length - i - 1; j++) {
              //     if (series[j].data > series[j + 1].data) {
              //       let swap = series[j];
              //       series[j] = series[j + 1];
              //       series[j + 1] = swap
              //     }
              //   }
              // }
              pieChart = new wxCharts({
                animation: true,
                canvasId: 'pieCanvas',
                type: 'ring',
                series: series,
                width: windowWidth,
                height: 290,
                dataLabel: true,
              });

              let series_ = [
                //   {
                //   name: '离线',
                //   data: that.data.ter_offline,
                //   color: '#98A0B3'
                // },
                //  {
                //   name: '异常',
                //   data: that.data.ter_error,
                //   color: '#f7b500'
                // },
                {
                  name: '到期',
                  data: that.data.ter_out,
                  color: '#1174fd'
                },
                {
                  name: '未到期',
                  data: that.data.ter_offline + that.data.ter_ok - that.data.ter_out,
                  color: '#f72000'
                },
                // {
                //   name: '在线',
                //   data: that.data.ter_ok,
                //   color: '#1174fd'
                // }
              ];
              pieChart = new wxCharts({
                animation: true,
                canvasId: 'pieCanvas_',
                type: 'pie',
                series: series_,
                width: windowWidth,
                height: 290,
                dataLabel: true,
              });

              let _series = [
                // {
              //   name: '离线',
              //   data: that.data.ter_offline,
              //   color: '#98A0B3'
              // },
               {
                name: '异常',
                data: that.data.ter_error,
                color: '#f7b500'
              },
                {
                  name: '正常',
                  data: that.data.ter_offline + that.data.ter_ok- that.data.ter_error,
                  color: '#1174fd'
                },
              //  {
              //   name: '到期',
              //   data: that.data.ter_out,
              //   color: '#f72000'
              // }, 
              // {
              //   name: '在线',
              //   data: that.data.ter_ok,
              //   color: '#1174fd'
              // }
              ];

              pieChart = new wxCharts({
                animation: true,
                canvasId: '_pieCanvas',
                type: 'ring',
                series: _series,
                width: windowWidth,
                height: 290,
                dataLabel: true,
              });

            };

          }
        });

      },
    })

  },

  onShareAppMessage(e) {
    if (e.from === 'button') {
      console.log(e.target)
    }
    return {
      title: '转发'
    }
  },

  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap');

  },

  scanCode: util.throttle(
    function() {
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
                var license = '';
                if (new_res.split(',').length == 4) {
                  license = new_res.split(',')[3];
                }
                that.setData({
                  reso: new_res.split(',')[2],
                  uuid: new_res.split(',')[1],
                  os: new_res.split(',')[0],
                  license: license,
                  submitFlag: 0
                });
                wx.navigateTo({
                  url: '../scan/scan?reso=' + that.data.reso + '&uuid=' + that.data.uuid + '&locationAddr=' + that.data.locationAddr + '&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude + '&license=' + license + '&os=' + that.data.os,
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
    }),

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

  open_ter: util.throttle(
    () => {
      wx.navigateTo({
        url: '../map/map',
      })
    }),
  epx: function(e) {
    wx.navigateTo({
      url: '../../../../../packageA/pages/exp/exp',
    })
  }
})