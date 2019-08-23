// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');

cloud.init({
  env: 'dev-nicemood'
})

const db = cloud.database({
  env: 'dev-nicemood'
})

const generateFileName = () => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  const fileName = `DailyPhoto/${year}${month}${day}.jpg`
  return fileName;
}

const reqOption = {
  url: 'https://source.unsplash.com/user/suchenrain/likes/600x960',
  method: 'GET',
  encoding: null
}
const callback = (err, res, body) => {
  if (res.statusCode === 200) {
    cloud.uploadFile({
      cloudPath: generateFileName(),
      fileContent: body,
    }).then((res) => {
      console.log(res)
    }, (err) => {
      console.log(err)
    })
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 8482292 https://api.unsplash.com/photos/random/?count=3&collections=8349391,8349361&client_id=ebecebfa0d4192a48cbccdbcb1304b25c613a604456a223e93904c7ebadf2170
  // step1: 获取一张随机图片信息
  // step2: 验证图片是否已存在(已存在=>step1,不存在=>step3)
  // step3: 添加数据库记录
  // step4: 下载图片并上传保存至云存储
  // step5：发送通知邮件（包括失败和成功）
  await request(reqOption, callback)
}