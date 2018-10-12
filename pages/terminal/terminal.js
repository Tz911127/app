// pages/terminal/terminal.js
var ip = require('../../utils/ip.js')
var start_clientX;
var end_clientX;
Page({
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    datalist: [],
    start: 0,
    temList: [],
    op: '',
    hasProgram: '',
    status: '',
    resolution: '',
    gid: '',
    tem_fir: '',
    provinceCode: '',
    city_no: '',
    city_name: '',
    searchInput: ''
  },
  onLoad: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      
      fail: function(res) {
        wx.redirectTo({
          url: '../login/login',
        })
      }

    })
  },

  onShow: function(e) {
    var that = this;
    var pages = getCurrentPages();
    var currPages = pages[pages.length - 1];
    that.setData({
      searchInput: '',
      search: ''
    })
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            oid: 0,
            length: 10,
            start: that.data.start
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            if (res.data.code == 2) {
              wx.redirectTo({
                url: '../login/login',
              })}
            that.setData({
              datalist: res.data.content.data
            });
            that.setData({
              bg: 'background:red'
            })

          }
        });

        wx.request({
          url: ip.init + '/api/terminal/getTerminalGroups;JSESSIONID=' + res.data,
          method: 'GET',
          data: {
            oid: 0
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            that.setData({
              groups: res.data.content
            })
            if (res.data.content.length > 0) {
              that.setData({
                team_fir: res.data.content[0].name,

              })
              if (res.data.content.length > 1) {
                that.setData({
                  team_sec: res.data.content[1].name,
                })
              }
            }
          }
        });

        wx.request({
          url: ip.init + '/api/auth/getUserSrc;JSESSIONID=' + res.data,
          method: "GET",
          data: {},
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            if (res.data.content.root_terminalReslotions.length > 0) {
              that.setData({
                tem_fir: currPages.data.resolution ? currPages.data.resolution : res.data.content.root_terminalReslotions[0],
                new_tem_fir: res.data.content.root_terminalReslotions[0],

              });
              if (res.data.content.root_terminalReslotions.length > 1) {
                that.setData({
                  tem_sec: res.data.content.root_terminalReslotions[1],
                  new_tem_sec: res.data.content.root_terminalReslotions[1]

                });
              }
            }

          }
        });

      },
      fail: function (res) {
        wx.redirectTo({
          url: '../login/login',
        })
      }
    })

  },

  tem_more: function() {
    wx.navigateTo({
      url: '../tem_more/tem_more',
    })
  },

  res_more: function() {
    wx.navigateTo({
      url: '../res_more/res_more',
    })
  },


  filter: function() {
    this.setData({
      display: "block",
      position: "position:fixed",
      translate: 'transform: translateX(-' + this.data.windowWidth * 0.7 + 'px);'
    })

  },
  // 遮拦
  hideview: function() {
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
    })
  },

  upArea: function() {
    wx.navigateTo({
      url: '../area/area',
    })
  },

  detail: function() {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  lower: function(e) {
    var that = this;
    wx.getStorage({
      key: 'sessionid',
      success: function(res) {
        that.setData({
          JSESSIONID: res.data
        })

        wx.request({
          url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + res.data,
          method: 'POST',
          data: {
            oid: 0,
            length: 10,
            search: that.data.search || '',
            start: that.data.start += 10,
            resolution: that.data.resolution,
            op: that.data.op,
            hasProgram: that.data.hasProgram,
            status: that.data.status,
            gid: that.data.gid,
            provinceCode: that.data.provinceCode,
            city_no: that.data.city_no,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            that.setData({
              datalist: that.data.datalist.concat(res.data.content.data),
            });
          }
        })
      }
    })
  },
  scroll: function(e) {
    // console.log(e)
  },

  search: function(e) {
    var that = this;
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
      search: e.detail.value || ''
    })
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      // method: 'POST',
      data: {
        oid: 0,
        search: e.detail.value || '',
        resolution: that.data.resolution,
        op: that.data.op,
        hasProgram: that.data.hasProgram,
        status: that.data.status,
        gid: that.data.gid,
        provinceCode: that.data.provinceCode,
        city_no: that.data.city_no
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.setData({
          datalist: res.data.content.data
        })
      }
    });

  },
  reset: function() {
    var that = this;
    that.setData({
      op: '',
      hasProgram: '',
      status: '',
      gid: '',
      resolution: '',
      provinceCode: '',
      city_no: '',
      tem_fir: that.data.new_tem_fir,
      tem_sec: that.data.new_tem_sec,
      hide_fir: '',
      hide_sec: '',
      opHide_fir: '',
      opHide_sec: '',
      proHide_fir: '',
      proHide_sec: '',
      hideSt_fir: "",
      hideSt_sec: "",
      hideSt_thr: "",
      hideSt_fou: "",
      city_name: "",
      search: "",
      teHide_fir: ''
    })
  },

  formSubmit: function(e) {
    var that = this;
    this.setData({
      display: "none",
      position: "position:absolute",
      translate: '',
    })
    wx.request({
      url: ip.init + '/api/terminal/getTerminalPageList;JSESSIONID=' + that.data.JSESSIONID,
      data: {
        oid: 0,
        search: that.data.search || '',
        resolution: that.data.resolution,
        op: that.data.op,
        hasProgram: that.data.hasProgram,
        status: that.data.status,
        gid: that.data.gid,
        provinceCode: that.data.provinceCode,
        city_no: that.data.city_no
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.setData({
          datalist: res.data.content.data
        })
      }
    });
  },
  //系统
  bindtapFuncOp_fir: function(e) {
    var that = this;
    that.data.op = e.currentTarget.dataset.text;
    that.setData({
      opHide_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      opHide_sec: ''
    })
  },
  bindtapFuncOp_sec: function(e) {
    var that = this;
    that.data.op = e.currentTarget.dataset.text;
    that.setData({
      opHide_fir: '',
      opHide_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
    })
  },
  //节目
  bindtapFuncPro_fir: function(e) {
    var that = this;
    that.data.hasProgram = e.currentTarget.dataset.text;
    that.setData({
      proHide_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      proHide_sec: ''
    })
  },
  bindtapFuncPro_sec: function(e) {
    var that = this;
    that.data.hasProgram = e.currentTarget.dataset.text;
    that.setData({
      proHide_fir: '',
      proHide_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
    })
  },
  //状态
  bindtapFuncSt_fir: function(e) {
    var that = this;
    that.data.status = e.currentTarget.dataset.text;
    that.setData({
      hideSt_fir: "background-color:#359df8; color:#fff; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACWElEQVRIS+2WS4hPURzHP1+PkpSFPCIpWbDwiBol8lyQnRqlyUJYKNmJFAbJY2FhozQLUR4pG89BimYhkVfETpmSpJQYef30y7k6/nPP3HPHZDZzlvf++n5+73NEPx31E5cB8J/Mm9kMYAuwFBgPfALuA23AeUn2L2UqTbWZ7QJ2AkMS4reA1ZLe9xbeDWxmu4HWDMF7wEJJXzJsu5n8BTaz6cBDYHCFWCfgqW6TtLcvwMeBjSVCjwD/dxR4AywBjgFzgHGSvtaFN0b8CpgURM6GploQGuwjMBl4AuwA1ga7eeF7qjxdwAlJR2LnGsHu+VDgHLAZmB06+zBwE1gHLAI2RCLNQAewOBH1KOAQsEpSe2HTCPYudXATcBlYBgwCTodvZdorJF3rKdVm5sA7kvanwFeB5ZHIHuAFcCYh/NPLIeltBdiDuCtpXwq8JkRX/P8G/ACGJYTbJcWOlpqZWSXY03obmJ/RpT6/TZKeVtlWgl3AzMaERvKZTh2Htki6UAUNmj1HXIiY2fCwvTYBIyJxr+kNYJukxznQWuDIAa/tXGAC8Bl4IOl1LjDSyYu4UdjMpgGdknyJ1D5ZNS5TNbPnwAFJp2pTf/dNryN28EFJJ/832BfLB2BrmOuY/13SOzPzu3t0iWO+Mq8D22PHs95c4TVyCZhYIvxS0lQzmxWu1G4tAlwEmuNbLAscRsLv6LFhdxfiKwG/dfxR4GM3E5gC+NgVp6vspZINTjSdj9t6wOfezzNJV3L6oDbYzEaGCFP7u+B2SGpJOVEbnBNNjs0AOCdLfWLzC2ML1R/ny/iSAAAAAElFTkSuQmCC');",
      hideSt_sec: "",
      hideSt_thr: "",
      hideSt_fou: ''
    })
  },
  bindtapFuncSt_sec: function(e) {
    var that = this;
    that.data.status = e.currentTarget.dataset.text;
    that.setData({
      hideSt_fir: "",
      hideSt_sec: "background-color:#359df8; color:#fff; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACcElEQVRIS+2WTYhOURjHf3/fkWRYSKwmpWnYyNckIsJCKTHTsFBkQbMTSVmJwsJHTXaiJiXFxldIWYyRjx0b8lFKiGFBE/LoeTszHde977137tRs5qzet/Oc/+95/uc551wxTEPDxGUEXHPezMYDO4A2YD4wEXgN3ABOSHpXdYv+s9rM5gBXgaYM8R/ALkldVeD/gM1sBvAEmJkj+gdolXR5sPAk+BKwOYh9A8YGm2s7ALyPkvoCNEr6Ohj4ANjMZgFvgVFBaCfwFLgDTAUOAJ1ALzA6xOyTdLwqeDtwLhL5CKwCxgHLgbPAFWB9FHNL0joz6wGmpSTgLr0AOiS9iufjig8ChxOLHd4k6bOZeTO1J+afSWo2szXA9BSw6291xyS1ZIE7gNPRpGfr9p4EZgOTgduJyh5KWlLPajNbCtyX5P0yMOKKXeBBNHcMOBTsXRBs9/P9KOqDTkl7csALgR5J/X1RC4/B/vs5MDcIXQsdvTL8d9vPA3vDOnekRZLvb+Yws/rg2nkxWwtcjyqqp9klaVteRxcCB7hbdyo6Mmna94ANkr4PGTjAVwC+x4sSwh9CUn5f/8qDBq18q5NCZtYIzAMmAW+8sST9LALsjylsdQq8AWiQ9LIMcCjArcARSV596VGl4i3A0Qpg75NuSWPirHM/fcxssd88wGogze5eSX1m5g/JhIQlru+npC2ZeC44dOYZYHfG+W6XdNHM/AHZmLIX/pp5zM1SFUdNMiXc1/H6u8BvwG+15vC6Je/7T2knoVDFWR0VHoBlYd4TuOAvWZEOLA02s/3B9jz9TZIeZwWVBufRis6PgIs6VTnuLzYB0x9NOSBRAAAAAElFTkSuQmCC');",
      hideSt_thr: "",
      hideSt_fou: ''
    })
  },
  bindtapFuncSt_thr: function(e) {
    var that = this;
    that.data.status = e.currentTarget.dataset.text;
    that.setData({
      hideSt_fir: "",
      hideSt_sec: "",
      hideSt_thr: "background-color:#359df8; color:#fff; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACSUlEQVRIS+2WS6hOURTHf3+PkjyKXLpCeRQD3NFVUhIDMlPXoztQHgMpM4+6cUXChJkJRZSJYuB5kaI7kEeSKJkoBiRR4iIsrTqf9t3fOd/Z55JvctfsnP79f2uvvdbeWzQp1CQug+A/lTezecA2YCnQCnwGHgAngHOS7G+2KbfUZrYH2A0MKzC/BayW9H6g8DqwmXUDexMM7wGLJX1N0NZJ+oHNbC7wCBiaaNYtaV+itp8sBh8HNgWKN8DU7Nv3dAxwDFiT/fsATJL0vSo8Br8EphWY/AK2Ai+Am4FmITC9wfb0AackHQl9Y7BnPjwCXwBOAt+A+8B64Gig6QB6gSUFCY8HDgOrJPXUNDHYu3RcZOClXgssA0YD7VEPrJB0rVGpzcyBdyQdKAJfBZZHJjuAzcCsHHMvf6uktyXgy8BdSfuLwOuAs5FJF7ABmJFj3iMpTrROZmal4CHAbWBRQpf6/LZLelKmLQW7gZm1ZF3rM10UDu2UdL4Mmnk2XnHNxMxGZuOxBRgVmPue3gB2SnqcAq0EDhIYASwAJgNfgIeSXqUCA5+0FcfGZjYHeC3pU1XogFYcZPwMOCjpTDPAhySd/t9gP1g+AtuBnxH8h6R3ZuZ394ScxPzIvA7sChNPenNlr5FLwJQc4+eSZptZW3al1rUIcBHoCG+xJHDWIH5HTwT8kKnFSsBvHX8U+NjNB2YCPna16Mt7qSSD8/bWzHzcNgI+9x5PJV1J6YPKYDMbm63QoY2iV1JnkaAyOGU1KZpBcEqV/onmNwgzzx/giR2SAAAAAElFTkSuQmCC');",
      hideSt_fou: ''
    })
  },
  bindtapFuncSt_fou: function(e) {
    var that = this;
    that.data.status = e.currentTarget.dataset.text;
    that.setData({
      hideSt_fir: "",
      hideSt_sec: "",
      hideSt_thr: "",
      hideSt_fou: "background-color:#359df8; color:#fff; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACSUlEQVRIS+2WTYhOcRTGfw+NSIhE+ZqFkM8iWRBlIh9bNspESmIxWcxCZGcxCx/ZKGNB+YjUsKDYUChKFizGytcspKwYRaRHhzvTneve9733fWU2c+ou7j3nPr//Oef/JYbJNExcRsC/K2+7BdgDtAPLgLHAO+AOcELS22Zb9Fepbc8FbgJLUuKvgVZgNPAN6JB0rhn4ELDt6cBTYHZGdDHQDaxJvjsqIulCo/As+AqwI0dsIXAWWJfyfQHmSfrQCHwQbDtKGSUdVRIcYcckHW0WvBs4XyCSl3GEPpa02vZtYFbOv9GSV0CnpDdpfzrjI5FBytkH3EveDwNXM6UOV5+kVtubgJkFg94OTJW0qgh8EDiVct4FTifvUf4zwJyMeK+kmHiFZns58AxokfRzIDCd8VrgQcV+XZIUa70WeCnwAhgj6UceOLLqBRZUgLdJut8UOH62vQW4VTCzs/o9krbVG6Tt2hkPCNjuAE4mu1SR7iNgq6T+fwZOMl8PHAdWZIQ/JYPqkvS9HjTRKpdxWsz2ouSQGAfEwfBE0tcywFQFq4OTEU8ApkmKjaCyle5xVtn2RuCapCmVqX8mbMMZbwCuS5r8v8HzgZfAZuB5Drw/+m57YnJhSIfEBrUXOCBpRtZRNxHbsYcfKlhi+yR1274I7MwR+wzskhSXi0ErfdmzPQmIJ209wHjgPRAr4AbQlQqI0+mjpLi1DLHS4Lyy2F4JtCW+OAAul70YVAbb3p+UvVaLItN2SQ+LgiqD606IkgEj4JKFaj7sF0kwzR9bRdY+AAAAAElFTkSuQmCC');"
    })
  },
  //分辨率
  bindtapFuncRe_fir: function(e) {
    var that = this;
    that.data.resolution = e.currentTarget.dataset.text;
    that.setData({
      hide_fir: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      hide_sec: ''
    })
  },
  bindtapFuncRe_sec: function(e) {
    var that = this;
    that.data.resolution = e.currentTarget.dataset.text;
    that.setData({
      hide_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff',
      hide_fir: ''
    })
  },
  //分组
  bindtapFuncTe_fir: function(e) {
    var that = this;
    that.data.gid = e.currentTarget.dataset.text.id;
    that.setData({
      teHide_fir: "background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff",
      teHide_sec: ''
    })
  },
  bindtapFuncTe_sec: function(e) {
    var that = this;
    that.data.gid = e.currentTarget.dataset.text.id;
    that.setData({
      teHide_fir: "",
      teHide_sec: 'background:linear-gradient(to bottom right, #40a9ff, #096dd9);color:#fff'
    })
  }
})