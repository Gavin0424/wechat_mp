// pages/admin/checkSettled.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerId: 0,
    customerName: '',
    customerAddress: '',
    customerContact: '',
    customerPhone: '',
    idPics: [],
    licensePics: [],
    createDate: '',
    checkDate: '',
    isCheck: 0
  },
  //获取商户信息
  getCustomerInfo: function (id) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.apiurl + '/getCustomerInfo',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 0) {
          let idImage = res.data.list[0].idSrc.split(',')
          let idImages = []
          idImage.forEach((val, key) => {
            let item = ''
            item = 'http://192.168.1.100:4000' + val
            idImages.push(item)
          })
          let licenseImage = 'http://192.168.1.100:4000' + res.data.list[0].licenseSrc
          let licenseImages = []
          licenseImages.push(licenseImage)
          that.setData({
            customerName: res.data.list[0].name,
            customerAddress: res.data.list[0].address,
            customerContact: res.data.list[0].contact,
            customerPhone: res.data.list[0].phone,
            createDate: util.transDatetime(res.data.list[0].createDate),
            checkDate: util.transDatetime(res.data.list[0].checkDate),
            isCheck: res.data.list[0].isCheck,
            idPics: idImages,
            licensePics: licenseImages
          })
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  // 审核入驻
  checkSettled(e) {
    wx.request({
      url: app.globalData.apiurl + '/checkCustomer',
      data: {
        id: this.data.customerId
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
          let i = setTimeout(() => {
            wx.redirectTo({
              url: './customerSettled',
            })
          }, 1000)
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
    let id = options.customerId
    console.log(id)
    this.setData({
      customerId: id
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
    this.getCustomerInfo(this.data.customerId)
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