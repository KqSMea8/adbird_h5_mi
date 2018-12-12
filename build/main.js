const async = require('async');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const buildIndex = require('./index');
const buildDetail = require('./detail');

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
            // 详情页
            detail: (cb) => {
                new buildDetail(()=>{
                    cb();
                });
            }
        }, () => {
            this.copy('index.css');
            this.copy('detail.css');
            this.copy('vue.js');
            this.copy('detail.js');
            this.copy('res');
            this.copy('icon');
            console.log( chalk.green('Builder构建完毕') );
        });
    }

    copy(name){
        fs.copySync( path.resolve(__dirname, `../static/${name}`), path.resolve(__dirname, `../release/static/${name}` ) );
    }

}
new Builder();