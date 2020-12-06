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

const getDataByType = (type) => {
  return types.find(x=>x.type === type)
}

export {types, getDataByType}