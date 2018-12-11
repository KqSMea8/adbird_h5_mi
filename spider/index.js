const async = require('async');
const chalk = require('chalk');
const spiderAll = require('./all');
const DBUtils = require('../utils/db');

class Spider {

    constructor() {
        this.run();
    }

    run(){
        async.series({
            //全部数据抓取
            all: (cb) => {
                new spiderAll();
            }
        }, () => {
            console.log( chalk.green('Spider抓取完毕') );
        });
    }

}
new Spider();