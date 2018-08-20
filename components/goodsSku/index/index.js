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

    fadeOut: '',

    attrValueList: [],

    commodityAttr: [],

    firstIndex: -1,

    includeGroup: [],

    includeGroups: [],

    sku_goods: [],//规格商品

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDialog(options) {
      var includeGroup = []
      includeGroup.push(options.commodityAttr[0])
      this.setData({
        commodityAttr: options.commodityAttr,
        includeGroup: includeGroup
      })

      this.updateGoodsSelected()
      this.distachAttrValue(options.commodityAttr);
    },

    showReturn() {
      var data = []
      data.attrValueList = this.data.attrValueList
      data.includeGroup = this.data.includeGroup
      data.sku_goods = this.data.sku_goods
      return data;
    },

    /* 获取数据 */
    distachAttrValue(commodityAttr) {
      /** 
        将后台返回的数据组合成类似 
        { 
          attrKey:'型号', 
          attrValueList:['1','2','3'] 
        } 
      */
      // 把数据对象的数据（视图使用），写到局部内  
      var attrValueList = this.data.attrValueList;
      // 遍历获取的数据  
      for (var i = 0; i < commodityAttr.length; i++) {
        for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {

          var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
          // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置  
          if (attrIndex >= 0) {
            // 如果属性值数组中没有该值，push新值；否则不处理  
            if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
              attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
            }
          } else {
            attrValueList.push({
              attrKey: commodityAttr[i].attrValueList[j].attrKey,
              attrValues: [commodityAttr[i].attrValueList[j].attrValue]
            });
          }
        }
      }
      for (var i = 0; i < attrValueList.length; i++) {
        for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
          if (attrValueList[i].attrValueStatus) {
            attrValueList[i].attrValueStatus[j] = true;
          } else {
            attrValueList[i].attrValueStatus = [];
            attrValueList[i].attrValueStatus[j] = true;
          }
        }
        attrValueList[i].selectedValue = attrValueList[i].attrValues[0]
      }
      this.setData({
        attrValueList: attrValueList
      });
    },

    getAttrIndex(attrName, attrValueList) {
      // 判断数组中的attrKey是否有该属性值  
      for (var i = 0; i < attrValueList.length; i++) {
        if (attrName == attrValueList[i].attrKey) {
          break;
        }
      }
      return i < attrValueList.length ? i : -1;
    },

    isValueExist(value, valueArr) {
      // 判断是否已有属性值  
      for (var i = 0; i < valueArr.length; i++) {
        if (valueArr[i] == value) {
          break;
        }
      }
      return i < valueArr.length;
    },

    /* 选择属性值事件 */
    selectAttrValue: function (e) {
      
      /* 
      点选属性值，联动判断其他属性值是否可选 
      { 
        attrKey:'型号', 
        attrValueList:['1','2','3'], 
        selectedValue:'1', 
        attrValueStatus:[true,true,true] 
      }  
      */
      var attrValueList = this.data.attrValueList;
      var index = e.currentTarget.dataset.index;//属性索引  
      var key = e.currentTarget.dataset.key;
      var value = e.currentTarget.dataset.value;
      attrValueList[index].selectedValue = value
      this.selectValue(attrValueList, index, key, value);
    },

    /* 选中 */
    selectValue: function (attrValueList, index, key, value, unselectStatus) {
      var includeGroup = [];
      // 所有sku商品
      var commodityAttr = this.data.commodityAttr;
      var arr = []
      for (var i = 0; i < commodityAttr.length; i++) {
        var num = 0
        for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
          if (attrValueList[j].attrKey == commodityAttr[i].attrValueList[j].attrKey && attrValueList[j].selectedValue == commodityAttr[i].attrValueList[j].attrValue) {
            num++
          }
        }
        if (commodityAttr[i].attrValueList.length == num) {
          arr.push(commodityAttr[i])
        }
      }
      this.setData({
        attrValueList: attrValueList,
        includeGroup: arr,
      });

      this.updateGoodsSelected()
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
    },

    updateGoodsSelected(){
      var includeGroup = this.data.includeGroup
      this.triggerEvent('updateGoodsSelected', includeGroup)
    }
  }
})
