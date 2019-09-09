/* eslint-disable import/no-commonjs */
// gulp 4.0 及以上
// mock相关
// 命令行执行：gulp mock 可以启动mock服务

const path = require("path");
const nodemon = require("gulp-nodemon");

const mockData = path.resolve(__dirname, "mock");

function mock() {
    // 设个变量来防止重复重启
    var started = false;
    var stream = nodemon({
        script: "./mock/server.js",
        // 监听文件的后缀
        ext: "js",
        env: {
            NODE_ENV: "development"
        },
        // 监听的路径
        watch: [mockData]
    });
    stream
        .on("start", function () {
            if (!started) {
                started = true;
            }
        })
        .on("crash", function () {
            console.error("application has crashed!\n");
            stream.emit("restart", 10);
        });
}

exports.default = mock;