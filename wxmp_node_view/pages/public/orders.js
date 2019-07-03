// pages/customer/orders.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: '',
    orders:[]
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    })
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    })
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    })
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  selectOrders(e) {
    if (this.data.inputVal == '') {
      this.getOrders(0)
    } else {
      this.getOrders(this.data.inputVal)
    }
  },
  getOrders: function(num) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.apiurl + '/getOrders',
      data: {
        num: num,
        customerId: app.globalData.customerId,
        isAdmin: app.globalData.isAdmin
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 0) {
          that.setData({
            orders: res.data.list
          })
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  orderInfo(e) {
    wx.navigateTo({
      url: '/pages/public/orderInfo?orderId=' + e.currentTarget.dataset.id,
    })
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
    this.getOrders(0)
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