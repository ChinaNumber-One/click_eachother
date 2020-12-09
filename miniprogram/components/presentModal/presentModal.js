// components/presentModal/presentModal.js
Component({
  properties: {
    num:{
      type:Number,
      value:0,
      observer(val){
        // 解决安卓 200  300 等数字显示不全的问题  
        // cover-view     overfilow:hidden   ,  改为auto 无法解决，暂时先计算宽度，之后有时间再研究
        this.setData({
          numLength: val.toString().length
        })
      }
    },
    desc:{
      type: String,
      value: ''
    },
    show:{
      type:Boolean,
      value:false,
      // observer(){
      //   this.setData({
      //     fileList:this.data.imgs
      //   })
      // }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    numLength: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeModal() {
      this.triggerEvent('close')
    }
  }
})
