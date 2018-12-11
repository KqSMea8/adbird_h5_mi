const async = require('async');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const buildIndex = require('./index');


class Builder {

    constructor() {
        this.run();
    }

    run(){
        async.series({
            // 首页
            index: (cb) => {
                new buildIndex(()=>{
                    cb();
                });
            },
            // // 好玩新品
            // now: (cb) => {
            //     new spiderNow(()=>{
            //         cb();
            //     });
            // },
            // // 热游推荐
            // hot: (cb) => {
            //     new spiderHot(()=>{
            //         cb();
            //     });
            // }
        }, () => {
            this.copy('index.css');
            this.copy('swipe.js');
            this.copy('res');
            console.log( chalk.green('Builder构建完毕') );
        });
    }

    copy(name){
        fs.copySync( path.resolve(__dirname, `../static/${name}`), path.resolve(__dirname, `../release/static/${name}` ) );
    }

}
new Builder();