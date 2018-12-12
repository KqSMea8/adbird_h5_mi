const async = require('async');
const chalk = require('chalk');
const spiderAll = require('./all');
const spiderNow = require('./now');
const spiderHot = require('./hot');
const spiderFirst = require('./first');
const DBUtils = require('../utils/db');

class Spider {

    constructor() {
        this.run();
    }

    run() {
        async.series({
            // 全部数据抓取
            all: (cb) => {
                new spiderAll(() => {
                    cb();
                });
            },
            // 好玩新品
            now: (cb) => {
                new spiderNow(() => {
                    cb();
                });
            },
            // 热游推荐
            hot: (cb) => {
                new spiderHot(() => {
                    cb();
                });
            },
            // 首页推荐
            first: (cb) => {
                new spiderFirst(() => {
                    cb();
                });
            }
        }, () => {
            console.log(chalk.green('Spider抓取完毕'));
        });
    }

}
new Spider();