// components/dialog/warning/warning.js
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
    title: '',
    content: '',
    confirmBtnClass: '',
    confirmHoverClass: '',
    showConfirm: true,
    showCancel: false,
    cancelLength: 'half',
    confirmLength: 'full',
    showDialog: false,
    fadeOut: '',
    confirmCb: undefined,
    cancelCb: undefined,
    dialogStyle: 'warning'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirmTap() {
      this.data.confirmCb()
      this.setData({
        fadeOut: 'fade-out'
      })
    },
    cancelTap() {
      this.data.cancelCb()
      this.setData({
        fadeOut: 'fade-out'
      })
    },
    fadeOutEnd() {
      this.setData({
        showDialog: false
      })
    },
    showDialog(options, confirmCb, cancelCb) {
      this.setData({
        title: options.title,
        content: options.content,
        showCancel: options.showCancel ? options.showCancel : false,
        showDialog: true,
        fadeOut: '',
        confirmLength: options.showCancel ? 'half' : 'full',
        cancelLength: options.showCancel ? 'half' : '',
        dialogStyle: options.dialogStyle ? options.dialogStyle : 'dialogStyle'
      })
      
      this.setData({
        confirmCb: confirmCb ? confirmCb : function() {},
        cancelCb: cancelCb ? cancelCb : function() {}
      })
    }
  }
})