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
        let tpl = fs.readFileSync(path.resolve(__dirname, `../tpl/now.html`)).toString();
        let releaseFile = path.resolve(__dirname, `../release/${channel.code}/now.html`);
        tpl = ejs.render(tpl, {
            channel: channel,
            title: 'Live Now',
            navName: 'New',
            list: DBUtils.getNowList(),
        });
        fs.ensureFileSync(releaseFile);
        fs.writeFileSync(releaseFile, WebUtils.minHtml(tpl) );
    }

}

module.exports = Builder;