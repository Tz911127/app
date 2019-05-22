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
    markers: [],

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
            })
          }
        });
      /*  wx.request({
          url: ip.init + '/api/program/getCheckProgramList;JSESSIONID=' + that.data.JSESSIONID,
          method: 'POST',
          data: {
            oid: 0,
            length: 10,
            start: 0
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            if (res.data.code == 1) {
              that.setData({
                proLength: res.data.content.data.length
              })
              if (res.data.content.data.length > 0) {
                // wx.showTabBarRedDot({
                //   index: 3,
                // })
              }
            }

          }
        });*/
    /*    wx.request({
          url: ip.init + '/api/material/materialCheck_getMaterialCheckList;JSESSIONID=' + that.data.JSESSIONID,
          method: 'POST',
          data: {
            oid: 0,
            length: 10,
            start: 0
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            if (res.data.code == 1) {
              that.setData({
                matLenght: res.data.content.data.length
              })
              if (res.data.content.data.length > 0) {
                // wx.showTabBarRedDot({
                //   index: 3,
                // })
              }
            }

          }
        });*/

        wx.request({
          url: ip.init + '/api/auth/getUserSrc;JSESSIONID=' + that.data.JSESSIONID,
          method: 'GET',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
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
          }
        })


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
              success: function(res) {
                if (res.data.code == 2) {
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
            });
      /*     wx.request({
              url: ip.init + '/api/auth/getUserSrc;JSESSIONID=' + that.data.JSESSIONID,
              method: 'GET',
              data: {},
              header: {
                'content-type': 'application/json'
              },
              success: function(res) {
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
                // wx.setStorage({
                //   key: 'root_terminalReslotions',
                //   data: 'res.data.content.root_terminalReslotions',
                // })
              }
            })*/
          },
        })

      },
    })


  },

  onShareAppMessage(e){
    if(e.from ==='button'){
      console.log(e.target)
    }
    return {
      title:'转发'
    }
  },

  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap');
    var that = this;
  },

  // play:function(){
  //   console.log(13)
  // },
  scanCode: function() {
    var that = this
    // wx.navigateTo({
    //   url: '../scan/scan',
    // });



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
              console.log(new_res)
              var license = '';
              if (new_res.split(',').length == 4) {
                license = new_res.split(',')[3];
              }
              that.setData({
                reso: new_res.split(',')[2],
                uuid: new_res.split(',')[1],
                os: new_res.split(',')[0],
                license: license,
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