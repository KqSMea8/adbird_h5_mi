const async = require('async');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const buildIndex = require('./index');
const buildDetail = require('./detail');
const buildPlay = require('./play');
const buildNow = require('./now');
const buildHot = require('./hot');
const buildCategory = require('./category');

class Builder {

    constructor() {
        this.run();
    }

    run(){
        async.series({
            // 首页
            index: (cb) => {
                new buildIndex(()=>{
                    console.log( chalk.green(`index`) );
                    cb();
                });
            },
            // 详情页
            detail: (cb) => {
                new buildDetail(()=>{
                    console.log( chalk.green(`detail`) );
                    cb();
                });
            },
            // 游戏页
            play: (cb) => {
                new buildPlay(()=>{
                    console.log( chalk.green(`play`) );
                    cb();
                });
            },
            // Now
            now: (cb) => {
                new buildNow(()=>{
                    console.log( chalk.green(`now`) );
                    cb();
                });
            },
            // Hot
            hot: (cb) => {
                new buildHot(()=>{
                    console.log( chalk.green(`hot`) );
                    cb();
                });
            },
            // Category
            category: (cb) => {
                new buildCategory(()=>{
                    console.log( chalk.green(`category`) );
                    cb();
                });
            }
        }, () => {
            this.copyCss(['index', 'detail', 'play', 'now'], false);
            this.copyJs(['vue', 'detail', 'play', 'gamead', 'lazyload'], false);
            this.copy('res');
            this.copy('icon');
            console.log( chalk.green('Builder构建完毕') );
        });
    }

    copyCss(list, min){
        list.forEach((name)=>{
            this.copy(`less/${name}.css`, `${name}.css`);
        });
    }

    copyJs(list, min){
        list.forEach((name)=>{
            this.copy(`${name}.js`);
        });
    }

    copy(fromPath, toPath){
        toPath = toPath || fromPath;
        fs.copySync( path.resolve(__dirname, `../static/${fromPath}`), path.resolve(__dirname, `../release/static/${toPath}` ) );
    }

}
new Builder();