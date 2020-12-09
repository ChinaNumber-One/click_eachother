const types = [
  {
    type: 1,
    presentModalNum: 100,
    presentModalDesc: '每日签到'
  },
  {
    type: 2,
    presentModalNum: 1000,
    presentModalDesc: '新人专享'
  },
  {
    type: 3,
    presentModalNum: 300,
    presentModalDesc: '完善头像和昵称'
  },
  {
    type: 4,
    presentModalNum: 200,
    presentModalDesc: '开启微信运动'
  }
]

const getDataByType = (type,obj) => {
  if([1,2,3,4].indexOf(type) !== -1) {
    return types.find(x=>x.type === type)
  } else {
    if(type === 5) {
      return {
        type: 5,
        presentModalNum: obj.steps / 20,
        presentModalDesc: `消耗${obj.steps}步数兑换金币`
      }
    }
  }
  
}

export {types, getDataByType}