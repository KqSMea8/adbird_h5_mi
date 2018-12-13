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
        let typeList = DBUtils.getTypes();
        typeList.forEach((category)=>{
            let tpl = fs.readFileSync(path.resolve(__dirname, `../tpl/now.html`)).toString();
            let releaseFile = path.resolve(__dirname, `../release/${channel.code}/category_${category}.html`);
            tpl = ejs.render(tpl, {
                channel: channel,
                title: 'Category',
                navName: 'Category',
                typeName: category,
                list: DBUtils.getTypeList(category),
                typeList: typeList
            });
            fs.ensureFileSync(releaseFile);
            fs.writeFileSync(releaseFile, WebUtils.minHtml(tpl) );
        });
    }

}

module.exports = Builder;