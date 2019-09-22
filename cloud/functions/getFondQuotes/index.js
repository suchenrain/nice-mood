// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'pro-nicemood'
})
const db = cloud.database({
  env: 'pro-nicemood'
})

const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    let timeLine;
    if (event.timeLine) {
      timeLine = new Date(event.timeLine)
    } else
      timeLine = new Date();
    const pageSize = event.pageSize || 50;


    const result = await db.collection('favorites-quote')
      .where({
        openid: wxContext.OPENID,
        createtime: _.lt(timeLine)
      }).orderBy('createtime', 'desc')
      .field({
        id: true,
        hitokoto: true,
        from: true,
        createtime: true,
      })
      .limit(pageSize)
      .get();

    result.data.forEach(element => {
      element.fondTime = element.createtime;
    });

    return Promise.resolve({
      data: result.data,
      nomore: result.data.length < pageSize
    })

  } catch (error) {
    return Promise.reject(error)
  }
}