// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');

cloud.init({
  env: 'dev-nicemood'
})

const db = cloud.database({
  env: 'dev-nicemood'
})

const max = 5;
let cur = 0;

const generateID = () => {
  const date = new Date();
  //设置为 UTC+8
  // date.setHours(date.getHours() + 8);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return `${year}${month}${day}`;
}

const generateFileName = () => {
  const id = generateID();
  const fileName = `DailyPhoto/${id}.jpg`
  return fileName;
}


getRandomPhoto = () => {
  const url = 'https://api.unsplash.com/photos/random/?collections=8482292&client_id=ebecebfa0d4192a48cbccdbcb1304b25c613a604456a223e93904c7ebadf2170'

  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) reject(err);
      resolve(JSON.parse(body))
    })
  });
}

checkExisting = (pid) => {
  return db.collection('dailyPhoto').where({
    pid: pid
  }).count()
}

addDailyPhotoRecord = (photo) => {
  return db.collection('dailyPhoto').add({
    data: {
      _id: generateID(),
      pid: photo.id,
      url: photo.urls.raw,
      author: photo.user.name,
      profile: photo.user.links.html,
      fileID: ''
    }
  })
}

getPhotpBuffer = (url) => {
  const reqOption = {
    uri: url,
    method: 'GET',
    qs: {
      w: 750,
      h: 1200,
      q: 70,
      fit: 'crop',
      fm: 'jpg',
      crop: 'entropy'
    },
    encoding: null
  }
  return new Promise((resolve, reject) => {
    request(reqOption, (err, res, body) => {
      if (err) reject(err);
      resolve(body)
    })
  })
}

uploadFile = (buffer) => {
  return cloud.uploadFile({
    cloudPath: generateFileName(),
    fileContent: buffer,
  })
}

updateDailyPhotoRecord = (pid, fileID) => {
  return db.collection('dailyPhoto').where({
    pid: pid
  }).update({
    data: {
      fileID: fileID
    }
  })
}

syncPhoto = async () => {
  console.log('start')
  const photo = await getRandomPhoto();
  if (photo && photo.id && photo.urls.raw) {
    const {
      total
    } = await checkExisting(photo.id);
    if (total === 0) {
      let _id = await addDailyPhotoRecord(photo);
      const buffer = await getPhotpBuffer(photo.urls.raw)
      if (buffer) {
        const {
          fileID
        } = await uploadFile(buffer)
        if (fileID) {
          const res = await updateDailyPhotoRecord(photo.id, fileID);
          if (res.stats) {
            console.log('ok');
            //sendNotification('success');
          } else {
            //sendNotification('fail');
            console.log('fail');
          }
        }
      }
    } else {
      if (cur < max) {
        cur++;
        syncPhoto();
      }
    }
  }
}

sendNotification = async (status) => {
  try {
    const result = await cloud.openapi.uniformMessage.send({
      touser: 'ow9oX0YetyA6A0QveVqw_74lqJ0A',
      // 需要formID
      // weappTemplateMsg: {
      //   page: 'page/page/index',
      //   data: {
      //     keyword1: {
      //       value: '每日图片更新状态'
      //     },
      //     keyword2: {
      //       value: status
      //     },
      //     keyword3: {
      //       value: new Date()
      //     }
      //   },
      //   templateId: 'ZZs_yBUv1EBvKpavn7MZwUFxZ5m6AhqB_bVCC8UksrA',
      //   formId: 'FORMID',
      //   emphasisKeyword: 'keyword2.DATA'
      // }
      // 需要同主体。。
      mpTemplateMsg: {
        appid: 'wx046f40cbed17594e',
        url: 'http://weixin.qq.com/download',
        miniprogram: {
          appid: 'wxb90d263ae339723c',
          pagepath: 'index'
        },
        data: {
          first: {
            value: 'NiceMood运行状态通知！',
            color: '#173177'
          },
          keyword1: {
            value: '每日图片自动更新',
            color: '#173177'
          },
          keyword2: {
            value: new Date(),
            color: '#173177'
          },
          keyword3: {
            value: status,
            color: '#173177'
          },
          remark: {
            value: '如有疑问请进入云开发后台查看详情',
            color: '#173177'
          }
        },
        templateId: 'hBGiI9eWsCeYRyEaAb6wqFTeN55KhAJnOco3rQ04YLk'
      }
    })
    console.log(result)
  } catch (err) {
    console.log(err);
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  await syncPhoto();
}