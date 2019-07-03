// pages/customer/orderInfo.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: 0,
    orderId: 0,
    isCheck: 0,
    sex: 0,
    age: 0,
    experience: 0,
    coachMajor: '',
    province: '',
    city:'',
    district:'',
    num: 0,
    height: 0,
    weight: 0,
    workDate: '',
    createDate: '',
    checkDate:'',
    customerName: ''
  },
  //获取订单信息
  getOrderInfo: function(id) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.apiurl + '/getOrderInfo',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 0) {
          that.setData({
            sex: res.data.list[0].sex,
            age: res.data.list[0].age,
            experience: res.data.list[0].experience,
            coachMajor: res.data.list[0].coachMajor,
            province: res.data.list[0].province,
            city: res.data.list[0].city,
            district: res.data.list[0].district,
            num: res.data.list[0].num,
            height: res.data.list[0].height,
            weight: res.data.list[0].weight,
            workDate: util.transDate(res.data.list[0].workDate),
            createDate: util.transDatetime(res.data.list[0].createDate),
            checkDate: util.transDatetime(res.data.list[0].checkDate),
            isCheck: res.data.list[0].isCheck,
            customerName: res.data.list[0].customerName
          })
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
// 审核订单
  checkOrder(e) {
    wx.request({
      url: app.globalData.apiurl + '/checkOrder',
      data: {
        id: this.data.orderId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '已完成',
            icon: 'success',
            duration: 1000
          })
          let i = setTimeout(()=> {
            wx.redirectTo({
              url: './orders',
            })
          },1000)
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.orderId
    this.setData({
      orderId: id,
      isAdmin: app.globalData.isAdmin
    })
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
    this.getOrderInfo(this.data.orderId)
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