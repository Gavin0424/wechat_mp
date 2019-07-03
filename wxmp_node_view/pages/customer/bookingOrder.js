// pages/orders/orders.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    errorTips: '',
    sexItems: [ //性别
      {
        name: '不限',
        value: '0',
        checked: 'true'
      },
      {
        name: '男',
        value: '1'
      },
      {
        name: '女',
        value: '2'
      }
    ],
    sexIndex: 0,
    //年龄
    ageItems: [
      { 
        name: '20-25',
        value: '0',
        checked: 'true'
      },
      {
        name: '25-30',
        value: '1'
      },
      {
        name: '30以上',
        value: '2'
      }
    ],
    ageIndex: 0,
    //工作经验
    exItems: [
      {
        name: '无',
        value: '0',
        checked: 'true'
      },
      {
        name: '1-3年',
        value: '1'
      },
      {
        name: '3年以上',
        value: '2'
      }
    ],
    exIndex: 0,
    //数量
    inputNum: '',
    //身高
    inputHeight: 0,
    //体重
    inputWeight: 0,
    //专业
    majorArray: [],
    majorIndex: 0,
    //需要地区
    region: ['上海市', '上海市', '黄浦区'],
    customItem: '全部',
    //到岗时间
    startDate: util.formatDate(new Date())
  },
  /**
   * 性别选择
   */
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let radioItems = this.data.sexItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      sexItems: radioItems,
      sexIndex: e.detail.value
    })
  },

  /**
   * 年龄选择
   */
  AgeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let radioItems = this.data.ageItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      ageItems: radioItems,
      ageIndex: e.detail.value
    })
  },
  /**
   * 工作经验选择
   */
  radioChangeEx(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let radioItems = this.data.exItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      exItems: radioItems,
      exIndex: e.detail.value
    })
  },
  /**
   * 数量录入
   */
  bindNumInput(e) {
    console.log('数量：' + e.detail.value)
    this.setData({
      inputNum: e.detail.value
    })
  },
  
  /**
   * 需要地区
   */
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 到岗时间
   */
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },

  //提交
  orderSubmit(e) {
    var that = this;
    if (this.data.inputNum == '') {
      this.setData({
        showTopTips: true,
        errorTips: '未输入人数'
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
    } else {
      //教练专业字典id
      let coachMajorId = this.coachMajor.data.DictionaryId
      let height = this.height.data.DictionaryId
      let weight = this.weight.data.DictionaryId
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.apiurl + '/bookingOrder',
        data: {
          sexIndex: this.data.sexIndex,
          ageIndex: this.data.ageIndex,
          exIndex: this.data.exIndex,
          coachMajorId: coachMajorId,
          region: this.data.region,
          inputNum: this.data.inputNum,
          inputHeight: height,
          inputWeight: weight,
          startDate: this.data.startDate,
          createDate: util.formatTime(new Date()),
          customerId: app.globalData.customerId
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //加载教练专业数据
    this.coachMajor = this.selectComponent('#coachMajor')
    this.coachMajor.initData()
    this.height = this.selectComponent('#height')
    this.height.initData()
    this.weight = this.selectComponent('#weight')
    this.weight.initData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})