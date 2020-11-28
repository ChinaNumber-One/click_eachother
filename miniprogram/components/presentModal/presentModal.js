// components/presentModal/presentModal.js
Component({
  properties: {
    num:{
      type:Number,
      value:0
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
