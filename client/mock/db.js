/* eslint-disable import/no-commonjs */
var Mock = require('mockjs')

var NewsFactory = require('./factory/news')

var news = Mock.Random.shuffle([
    ...NewsFactory.randomMulti(8)
])

module.exports = {
    news: { result: { data: news } }
}