// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'YOUR CLOUD ENV ID'
})
const db = cloud.database({
  env: 'YOUR CLOUD ENV ID'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const pageIndex = event.pageIndex || 1;
    const pageSize = event.pageSize || 50;
    const skipCount = (pageIndex - 1) * pageSize;

    // 先取出集合记录总数
    const countResult = await db.collection('favorites-quote').where({
      openid: wxContext.OPENID,
    }).count();
    const total = countResult.total

    if (total <= 0) {
      return Promise.resolve({
        totalPage: 0,
        pageIndex,
        data: []
      })
    }

    // 计算需分几次取
    const totalPage = Math.ceil(total / pageSize)
    if (pageIndex > totalPage) {
      return Promise.reject({ error: "invalid page index" })
    }

    const result = await db.collection('favorites-quote')
      .where({
        openid: wxContext.OPENID,
      }).orderBy('createtime', 'desc')
      .skip(skipCount)
      .field({
        id: true,
        hitokoto: true,
        from: true
      })
      .limit(pageSize)
      .get();

    return Promise.resolve({
      totalPage,
      pageIndex,
      data: result.data

    })
  }
  catch (error) {
    return Promise.reject(error)
  }
}