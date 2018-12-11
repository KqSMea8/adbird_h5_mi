const async = require('async');
const chalk = require('chalk');
const spiderAll = require('./all');

class Spider {

    constructor() {
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