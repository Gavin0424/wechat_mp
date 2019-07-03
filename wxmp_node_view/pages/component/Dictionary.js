// pages/component/Dictionary.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    typeName: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    Array: [], //字典名称数组
    list: [], //字典数据数组(id,name,typeName)
    index: 0, //显示下标
    DictionaryId: 0 //字典id
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //加载数据
    initData: function() {
      let typeName = this.properties.typeName
      let that = this
      wx.request({
        url: app.globalData.apiurl + '/loadDictionary',
        data: {
          typeName: typeName
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          //console.log(res)
          let array = []
          if (res.data.code == 0) {
            for (let i in res.data.list) {
              let name = res.data.list[i].name
              array.push(name)
            }
            that.setData({
              list: res.data.list,
              Array: array,
              DictionaryId: res.data.list[0].id
            })
            console.log('DictionaryId:' + that.data.DictionaryId)
          }
        }
      })
    },
    //选择事件
    bindPickerChange(e) {
      for (let i in this.data.list) {
        if (this.data.list[i].name == this.data.Array[e.detail.value]) {
          this.setData({
            DictionaryId: this.data.list[i].id
          })
        }
      }
      this.setData({
        index: e.detail.value
      })
      console.log('DictionaryId:' + this.data.DictionaryId)
    }
  }
})