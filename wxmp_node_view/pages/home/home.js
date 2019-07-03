// pages/home/home.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '/images/man.jpg',
      '/images/women.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 1000
  },
  bookingOrder(e) {
    if (app.globalData.userId == '') {//用户表中无
      if (app.globalData.customerId == '') {//商户表中无
        wx.showModal({
          title: '提示',
          content: '亲，商家入驻后才能下单',
          confirmText: "入驻",
          cancelText: '返回',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/customer/settledIn',
              })
              //console.log('用户点击主操作')
            } else {
              //console.log('用户点击辅助操作')
            }
          }
        })
      } else {
        wx.showModal({
          content: '商户入驻信息审核中...',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              //console.log('用户点击确定')
            }
          }
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/customer/bookingOrder',
      })
    }
  },

  settledIn(e) {
    if (app.globalData.customerId == '') {
      wx.navigateTo({
        url: '/pages/customer/settledIn',
      })
    } else {
      wx.showModal({
        content: '您已成功入驻',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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