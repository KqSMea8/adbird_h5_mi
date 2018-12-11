const async = require('async');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const DBUtils = require('../utils/db');

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
            nowList: DBUtils.getNowList(),
            nowColor: this.nowColor
        });
        fs.ensureFileSync(releaseFile);
        fs.writeFileSync(releaseFile, tpl);
    }

    nowColor(index){
        let yu = index%3;
        if( yu == 0 ){
            return 'rgba(129,196,58,.9)';
        }
        else if( yu == 1 ){
            return 'rgba(39,114,58,.9)'
        }
        else{
            return 'rgba(67,151,23,.9)';
        }
    }

}

module.exports = Builder;