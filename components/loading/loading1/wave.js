// components/loading/loading1/wave.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    fadeOut: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showLoading() {
      this.setData({
        show: true,
        fadeOut: ''
      })
    },
    hideLoading() {
      this.setData({
        fadeOut: 'fade-out'
      })
    },
    hideAniEnd() {
      this.setData({
        show: false
      })
      this.triggerEvent('closeLoading', 1, 1)
    }
  }
})
