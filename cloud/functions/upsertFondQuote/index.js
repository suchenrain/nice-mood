// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-nicemood'
})
const db = cloud.database({
  env: 'dev-nicemood'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    return await db.collection('favorites-quote').add({
      data: {
        openid: wxContext.OPENID,
        id: event.quote.id,
        hitokoto: event.quote.hitokoto,
        from: event.quote.from,
        createtime: new Date()
      }
    })
  } catch (e) {
    console.error(e)
  }
}