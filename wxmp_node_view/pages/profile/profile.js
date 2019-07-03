// pages/profile/profile.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userActor: '',
    isAdmin: false,
    isCustomer: false
  },

  userinfo(e) {
    console.log(this.data)
    if (this.data.userActor == '游客') {
      wx.showModal({
        title: '提示',
        content: '是否前往商家入驻',
        confirmText: "入驻",
        cancelText: '返回',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/customer/settledIn',
            })
          }
        }
      })
    } else if (this.data.userActor == '管理员') {
      
    } else {
      wx.navigateTo({
        url: '/pages/customer/customerInfo',
      })
    }
  },
  /**
   * 我的订单
   */
  myOrder(e) {
    wx.navigateTo({
      url: '/pages/public/orders',
    })
  },

  /**
   * 审核入驻
   */
  checkSettled(e) {
    wx.navigateTo({
      url: '/pages/admin/customerSettled',
    })
  },
  /**
   * 审核订单
   */
  checkOrder(e) {
    wx.navigateTo({
      url: '/pages/public/orders',
    })
  },
  /**
   * 联系电话
   */
  call(e) {
    wx.makePhoneCall({
      phoneNumber: '4008780833'
    })
  },
/**
 * 获取用户信息
 */
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.isAdmin == 1) {
      this.setData({
        userActor: '管理员',
        isAdmin: true
      })
    }
    if (app.globalData.userId == '' && app.globalData.customerName == '') {
      this.setData({
        userActor: '游客'
      })
    }
    if (app.globalData.customerName != '') {
      this.setData({
        userActor: app.globalData.customerName,
        isCustomer: true
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})