/**
 * 首页提示操作动画组件
 */
Component({

  options: {

    multipleSlots: true//   在组件定义时的选项中启用多slot支持

  },

  /**
   * 组件的属性列表
   */
  properties: {


  },

  /**
   * 组件的初始数据
   */
  data: {

    arrow: true,

    dialog: true,

    hidden: false,

    fadeOut: ''
    
  },
  
  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 显示指示箭头
     */
    aniend1() {
      this.setData({
        arrow: false
      })
    },

    /**
     * 显示对话框
     */
    aniend2() {
      this.setData({
        dialog: false
      })
    },

    fadeOut() {
      this.setData({
        fadeOut: 'fade-out'
      })
    },

    aniEnd() {
      this.setData({
        hidden: true
      })
    },
    
    stopPopEvent(evt) {
      evt.preventDefault();
    }
  }
})
