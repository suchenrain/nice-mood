/* eslint-disable import/no-commonjs */
var Mock = require('mockjs');

var Random = Mock.Random;

const newsSeed = {
    _id: "@increment",
    title: "@ctitle(10, 20)",
    des: "@cparagraph",
    lunar: "@cword(5,12)",
    thumbnail_pic_s: Random.image('400x300'),
}

module.exports = {
    randomMulti: (number = 10) => {
        let seeds = [];
        for (let i = 0; i < number; i++) {
            seeds.push(newsSeed);
        }
        return Mock.mock(seeds);
    }
}