// pages/customer/settledIn.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    code: '',//用户微信code
    idPics: [],
    showAddId: true,
    licensePics: [],
    showAddLicense: true,
    isAgree: false,
    isCanSubmit: true,
    customerPhone: '',
    customerContact: '',
    customerAddress: '',
    customerName: '',
    idImagesSrc: ''
  },
/**
 * 商家名称
 */
  inputCustomerName(e) {
    console.log(e.detail.value)
    this.setData({
      customerName: e.detail.value
    })
  },
/**
 * 商家地址
 */
  inputCustomerAddress(e) {
    console.log(e.detail.value)
    this.setData({
      customerAddress: e.detail.value
    })
  },
/**
 * 联系人
 */
  inputCustomerContact(e) {
    console.log(e.detail.value)
    this.setData({
      customerContact: e.detail.value
    })
  },
/**
 * 手机号码
 */
  inputCustomerPhone(e) {
    console.log(e.detail.value)
    this.setData({
      customerPhone: e.detail.value
    })
  },
/**
 * 身份证
 */
  chooseIdPics: function (e) {
    if(this.data.idPics.length < 2) {
      var that = this
      wx.chooseImage({
        count: 2,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            idPics: that.data.idPics.concat(res.tempFilePaths)
          })
          if(that.data.idPics.length == 2) {
            that.setData({
              showAddId: false
            })
          }
        }
      })
    }
  },
  /**
   * 营业执照
   */
  chooseLicensePics: function (e) {
    if(this.data.licensePics.length == 0) {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            licensePics: that.data.licensePics.concat(res.tempFilePaths)
          })
          if(that.data.licensePics.length == 1) {
            that.setData({
              showAddLicense: false
            })
          }
        }
      })
    } 
  },
  /**
   * 替换身份证
   */
  replaceIdImage: function (e) {
    let index = e.currentTarget.dataset.id
    let that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let item = res.tempFilePaths
        let idPics = that.data.idPics
        idPics.splice(index, 1, item)
        that.setData({
          idPics: idPics
        })
      }
    })
  },
  /**
     * 替换营业执照
     */
  replaceLicenseImage: function (e) {
    let index = e.currentTarget.dataset.id
    let that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let item = res.tempFilePaths
        let licensePics = that.data.licensePics
        licensePics.splice(index, 1, item)
        that.setData({
          licensePics: licensePics
        })
      }
    })
  },

  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length,
      isCanSubmit: !this.data.isCanSubmit
    });
  },
/**
 * 录入项提示
 */
showError: (name) => {
  let that = this
  this.setData({
    showTopTips: true,
    errorTips: name
  })
  setTimeout(function () {
    that.setData({
      showTopTips: false
    });
  }, 3000)
},
/**
 * 上传图片
 */
  uploadImage: function (images) {
    let strSrc = ''
    let success = 0 //上传成功的个数
    return new Promise(function (resolve, reject) {
      for (var i = 0; i < images.length; i++) {
        wx.uploadFile({
          url: app.globalData.apiurl + '/upload',
          filePath: images[i],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          method: "POST",
          success: (res) => {
            var jsonres = JSON.parse(res.data)
            if (jsonres.code == '0') {
              if (strSrc == '') {
                strSrc = jsonres.path
              }
              else {
                strSrc += ',' + jsonres.path
              }
              success++
              if (success == images.length) {
                console.log('上传图片执行完毕');
                console.log('路径：' + strSrc)
                resolve(strSrc)
              }
            } else {
              reject('upload error')
            }
          },
          fail: (res) => {
            reject('upload error')
          }
        })
      }
    })
  },
  //提交
  settledInSubmit(e) {
    if (this.data.customerName == '') {
      this.showError('未输入商家名称')
    } else if (this.data.customerAddress == '') {
      this.showError('未输入商家地址')
    } else if(this.data.customerContact == '') {
      this.showError('未输入联系人')
    } else if(this.data.customerPhone == '') {
      this.showError('未输入手机号码')
    } else if (this.data.idPics.length < 2) {
      this.showError('未上传身份证正反面')
    } else if (this.data.licensePics.length < 1) {
      this.showError('未上传营业执照')
    } else {
      let that = this
      wx.showLoading({
        title: '处理中',
      })
      this.uploadImage(this.data.idPics).then(res => {
        if (res != 'upload error') {
          that.setData({
            idImagesSrc: res
          })
          let thatt = that
          that.uploadImage(that.data.licensePics).then(res => {
            wx.request({
              url: app.globalData.apiurl + '/settledIn',
              data: {
                code: thatt.data.code,
                customerName: thatt.data.customerName,
                customerAddress: thatt.data.customerAddress,
                customerContact: thatt.data.customerContact,
                customerPhone: thatt.data.customerPhone,
                idImage: thatt.data.idImagesSrc,
                licenseImage: res,
                createDate: util.formatTime(new Date())
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                wx.hideLoading()
                console.log(res.data)
                if (res.data.code == 0) {//新增成功
                  wx.redirectTo({
                    url: '/pages/public/msg_success',
                  })
                } else {//新增失败
                  wx.navigateTo({
                    url: '/pages/public/msg_fail',
                  })
                }
              },
              fail(res) {
                console.log(res)
              }
            })
          })
        } else {
          wx.showToast({
            title: "上传身份证照片异常",
            icon: "none",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log('upload error：' + err)
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.login({
      success: res => {
        that.setData({
          code: res.code
        })
      }
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