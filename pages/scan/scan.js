// pages/scan/scan.js
var util = require('../../utils/util.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var ip = require('../../utils/ip.js')
var sMD5 = require('../../utils/spark-md5.js')
var base = require('../../utils/base.js')
var qqmapsdk;
var formatLocation = util.formatLocation;
Page({

  data: {
    hasLocation: false,
    token: '',
    locationAddress: '',
    remark: '',
    name: '',
    closeShotId: "",
    longShotId: "",
    aroundShotId: "",
    otherShotId: "",
  },
  onLoad: function (e) {
    var that = this;
    that.setData({
      reso: e.reso,
      uuid: e.uuid,
      locationAddress: e.locationAddr,
      longitude: e.longitude,
      latitude: e.latitude,
      license: e.license,
      os: e.os
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data
        })
      },
    });
    wx.getStorage({
      key: 'sessionid',
      success: function (res) {
        that.setData({
          JSESSIONID: res.data
        })
      },
    });

    qqmapsdk = new QQMapWX({
      key: 'DFUBZ-FSIC6-P7OS7-MNHFC-IRRKK-L3FJJ'
    });

    wx.getLocation({
      success: function (res) {
        that.setData({
          hasLocation: true,
          location: formatLocation(res.longitude, res.latitude)
        })
      }
    })





  },

  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          hasLocation: true,
          locationAddress: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    });

  },
  remarkInput: function (e) {
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
    var FSM = wx.getFileSystemManager();
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
          that.getFile(0);
          that.setData({
            jsrc: res.tempFilePaths[0],
          });
        } else if (e.currentTarget.dataset.name === 'ysrc') {
          that.getFile(1);
          that.setData({
            ysrc: res.tempFilePaths[0],
          });
        } else if (e.currentTarget.dataset.name === 'zsrc') {
          that.getFile(2);
          that.setData({
            zsrc: res.tempFilePaths[0],
          });
        } else if (e.currentTarget.dataset.name === 'osrc') {
          that.getFile(3);
          that.setData({
            osrc: res.tempFilePaths[0],
          });
        };


      },

    })
  },
  getFile: function (sceneType) {
    let that = this;
    let tempFilePaths = that.data.tempFilePaths;
    let picName = that.data.picName;
    let ext = tempFilePaths[0].split('.').reverse()[0];
    console.log(ext)
    wx.getFileSystemManager().readFile({
      filePath: that.data.tempFilePaths[0],
      success: res => {
        //成功的回调
        var spark = new sMD5.ArrayBuffer();
        spark.append(res.data);
        var base = wx.arrayBufferToBase64();
        var hexHash = spark.end(false);
        util.sha1_to_base64(hexHash);
        wx.request({
          url: ip.init + '/api/terminalShot/getOssSignatureForShot;JSESSIONID=' + that.data.JSESSIONID,
          method: 'get',
          data: {
            type: 10,
            md5: util.sha1_to_base64(hexHash)
          },
          success: function (res) {
            if (typeof (res.data.content) == 'string') {
              let sceneData = res.data.content;
              that.siwtch(sceneType, sceneData)

            } else {
              wx.uploadFile({
                url: res.data.content.host,
                filePath: tempFilePaths[0],
                name: 'file',
                formData: {
                  'OSSAccessKeyId': res.data.content.accessid,
                  'policy': res.data.content.policy,
                  'Signature': res.data.content.signature,
                  'key': res.data.content.key + '.' + ext,
                  'callback': res.data.content.callback,
                  "x:token": res.data.content.token,
                  "x:extra": JSON.stringify({
                    "sceneType": sceneType
                  }),
                  "x:opt": 3,
                  "x:type": 10
                },
                success: function (res) {
                
                  let sceneData = JSON.parse(res.data);
                  that.siwtch(sceneType, sceneData.content)
                }
              })
            }
          }

        });

      }
    })
  },

  siwtch: function (sceneType, sceneData) {
    let that = this;
    switch (sceneType) {
      case 0:
        that.setData({
          closeShotId: sceneData
        });
        break;
      case 1:
        that.setData({
          longShotId: sceneData
        });
        break;
      case 2:
        that.setData({
          aroundShotId: sceneData
        });
        break
      case 3:
        that.setData({
          otherShotId: sceneData
        });
        break
    }
  },


  ok_btn: util.throttle(
    function () {
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
        wx.showLoading({
          title: '加载中',
        })
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
            remark: that.data.remark,
            closeShotId: that.data.closeShotId,
            longShotId: that.data.longShotId,
            aroundShotId: that.data.aroundShotId,
            otherShotId: that.data.otherShotId,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            if (res.data.code == 1) {
              wx.hideLoading();
              wx.showToast({
                title: '注册成功',
                success: function (e) {
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    });
                  }, 2000)
                }
              })

            } else if (res.data.code == 0) {
              if (locationAddress == 'undefined') {
                wx.showToast({
                  title: "请开启定位",
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            }
          }
        })
      }


    })

})