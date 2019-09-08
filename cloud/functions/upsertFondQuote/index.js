// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'pro-nicemood'
})
const db = cloud.database({
  env: 'pro-nicemood'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const fond = event.fond;

  try {
    if (fond) {
      const res = await db.collection('favorites-quote').where({
        openid: wxContext.OPENID,
        id: event.quote.id
      }).count();

      if (res.total > 0) return Promise.resolve(0);

      return await db.collection('favorites-quote').add({
        data: {
          openid: wxContext.OPENID,
          id: event.quote.id,
          hitokoto: event.quote.hitokoto,
          from: event.quote.from,
          createtime: new Date()
        }
      })
    } else {
      return await db.collection('favorites-quote').where({
        openid: wxContext.OPENID,
        id: event.quote.id
      }).remove();
    }

  } catch (e) {
    console.error(e)
  }
}