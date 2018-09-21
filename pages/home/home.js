var ip = require('../../utils/ip.js')
Page({
  data: {
    result: '',
    scale: 10,
    controls: '40',
    covers: [

      {
        latitude: 30.461552470716,
        longitude: 114.32383792579
      }
    ],
    longitude: [],
    latitude: [],
    markers: []

  },
  onLoad: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.getLocation({
          success: function(res) {
            console.log(res)
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: [{
                latitude: res.latitude,
                longitude: res.longitude,
              }]
            });
          }
        });


        wx.request({
          url: ip.init + '/api/terminal/getAllTerminalInfoForMap;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            latitude: 30.57646624896193,
            longitude:114.11743750339399,
            maxDistance: 1,
            length:100
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            var dataList = res.data.content.statusSummary;
            var ter_ok = [];
            var ter_offline = [];
            var ter_error = [];
            var ter_out = [];
            var tem_covers = [];
            var tem_cover = {};
            for (var i = 0; i < dataList.length; i++) {
              if (dataList[i].status == 1) {
                that.setData({
                  ter_ok: dataList[i].count
                });
              } else if (dataList[i].status == 2) {
                that.setData({
                  ter_offline: dataList[i].count
                });
              } else if (dataList[i].status == 3) {
                that.setData({
                  ter_error: dataList[i].count
                });
              } else if (dataList[i].status == 4) {
                that.setData({
                  ter_out: dataList[i].count
                });
              }
            }

            for (var i = 0; i < tem_covers.length; i++) {
              tem_cover.latitude = tem_covers[i].x;
              tem_cover.longitude = tem_covers[i].y;
            }
        
          }
        })
      }
    })

  },





  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap');
  },
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