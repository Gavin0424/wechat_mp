//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    let that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res)
        wx.request({
          url: this.globalData.apiurl + '/login',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if(res.data.code == 0) {
              let idImage = res.data.idSrc.split(',')
              let idImages = []
              idImage.forEach((val,key) => {
                let item = ''
                item = 'http://192.168.1.100:4000' + val
                idImages.push(item)
              })
              let licenseImage = 'http://192.168.1.100:4000' + res.data.licenseSrc
              let licenseImages = []
              licenseImages.push(licenseImage)
              that.globalData.userId = res.data.userId,
              that.globalData.isAdmin = res.data.isAdmin,
              that.globalData.customerId = res.data.customerId,
              that.globalData.customerName = res.data.customerName,
              that.globalData.customerAddress = res.data.customerAddress,
              that.globalData.customerContact = res.data.contact,
              that.globalData.customerPhone = res.data.phone,
              that.globalData.idPics = idImages,
              that.globalData.licensePics = licenseImages
            }
            console.log('customerId: ' + that.globalData.customerId)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    apiurl: 'http://192.168.1.100:4000/api',
    userId: '',//用户id
    isAdmin: '',
    customerId: '',//商家id
    customerName: '',//商家名称
    customerAddress: '',
    customerContact: '',
    customerPhone: '',
    idPics: [],
    licenseSrc: []
  }
})