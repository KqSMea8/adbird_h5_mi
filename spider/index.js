const async = require('async');
const chalk = require('chalk');
const spiderAll = require('./all');
const spiderNow = require('./now');
const DBUtils = require('../utils/db');

class Spider {

    constructor() {
        this.run();
    }

    run(){
        async.series({
            // 全部数据抓取
            all: (cb) => {
                new spiderAll(()=>{
                    cb();
                });
            },
            // 好玩新品
            now: (cb) => {
                new spiderNow(()=>{
                    cb();
                });
            }
        }, () => {
            console.log( chalk.green('Spider抓取完毕') );
        });
    }

}
new Spider();