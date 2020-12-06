const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
exports.main = async (event, context) => {
  const {
    openId
  } = event
  let res = await db.collection('user').where({
    _openid: openId
  }).get()
  if (res.data.length && res.data[0].qrcode) {
    return {
      code: 0,
      data: res.data[0].qrcode
    }
  } else {
    const wxacodeResult = await cloud.openapi.wxacode.getUnlimited({
      scene: event.openId,
    });
    const uploadResult = await cloud.uploadFile({
      cloudPath: `qrcode/wxacode-${event.openId}.jpg`,
      fileContent: wxacodeResult.buffer,
    });
    if (uploadResult.fileID) {
      let data = res.data[0]
      const updateRes = await db.collection('user').doc(data._id).update({
        data: {
          qrcode: uploadResult.fileID
        }
      })
      if (updateRes.errMsg === 'document.update:ok') {
        return {
          code: 0,
          data: uploadResult.fileID
        }
      } else {
        return {
          code: 500
        }
      }
    } else {
      return {
        code: 500
      }
    }
  }
};