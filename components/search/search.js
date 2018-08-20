var app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    topPosition: {

      "type": "number",

      value: 0

    },

    searchType: {

      "type": "number",

      value: 1

    }

    

  },

  /**
   * 组件的初始数据
   */
  data: {

    location: { city: '' }

  },

  ready() {

    this.setLocation()

  },

  /**
   * 组件的方法列表
   */
  methods: {

    setLocation() {

      this.setData({

        location: app.storage.getLocation()

      })

    },

    selectCity() {

      wx.navigateTo({

        url: '/pages/location/city/city'

      })

    },

    confirmInput(evt) {

      var value = evt.detail.value

      var that = this

      switch (this.properties.searchType) {

        case '1':

          wx.navigateTo({

            url: '/pages/goods/list/list?name=' + value

          })

          break;

        case '2':

          app.crmApi(

            app.apiService.crm.searchAllAddress,

            {

              token: app.storage.getToken(),

              content: value

            },

            res => {

              if (res.data.ret == 200) {

                that.triggerEvent('searchalladdress', res.data.data, {})

              }

            }

          )

          break;

      }

    }

  }
  
})
