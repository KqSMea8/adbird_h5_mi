const async = require('async');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const DBUtils = require('../utils/db');
const WebUtils = require('../utils/web');

class Builder {

    constructor(done) {
        async.eachOfSeries(DBUtils.getChannelList(), (channel, index, cb) => {
            this.doBuild(channel);
            cb();
        }, () => {
            done();
        })
    }

    doBuild(channel) {
        let tpl = fs.readFileSync(path.resolve(__dirname, `../tpl/index.html`)).toString();
        let releaseFile = path.resolve(__dirname, `../release/${channel.code}/index.html`);
        tpl = ejs.render(tpl, {
            channel: channel,
            nowList: this.liveNowList(),
            bigList: this.bigList()
        });
        fs.ensureFileSync(releaseFile);
        fs.writeFileSync(releaseFile, WebUtils.minHtml(tpl) );
    }

    liveNowList(){
        const nowList = DBUtils.getNowList();
        const hotList = DBUtils.getHotList();
        const ret = [];
        for(let i=0; i<nowList.length; i++){
            let find = false;
            for(let n=0; n<8; n++){
                if( hotList[n].id == nowList[i].id ){
                    find = true;
                    break;
                }
            }
            if( !find ){
                ret.push(nowList[i]);
            }
            if( ret.length >= 4 ){
                break;
            }
        }
        return ret;
    }

    bigList(){
        let ret = [];
        ret.push({
            title: 'Hot Games',
            href: 'hot.html',
            list: DBUtils.getHotList()
        });
        let typeList = ['Beauty & Girl', 'Arcade', 'Sports & Racing', 'Strategy', 'Puzzle & Logic', 'Adventure', 'Action & Risk', 'Music'];
        typeList.forEach((type)=>{
            ret.push({
                title: type,
                href: `category_${type}.html`,
                list: DBUtils.getTypeListFromFirst(type),
                icon: true
            });
        });
        return ret;
    }

}

module.exports = Builder;