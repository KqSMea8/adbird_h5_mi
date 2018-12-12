const async = require('async');
const WebUtils = require('../utils/web');
const DBUtils = require('../utils/db');
const MathUtils = require('../utils/number');
const cheerio = require('cherio');

module.exports = class SpiderAll {

    constructor(done) {
        this.done = done;
        this.init();
    }

    init(){
        this.run();
    }

    run(){
        let idlist = [];
        let skip = 8;
        WebUtils.getBodyFromUrl('http://mi.gameasy.top/').then((body) => {
            const $ = cheerio.load(body);
            $('.card').each((i, elem) => {
                let source_detail_url = $(elem).find('a').attr('href');
                let id = MathUtils.int( source_detail_url.replace(/[a-z\/\?\=\:\.]/gi, '') );
                if( !skip ){
                    idlist.push(id);
                }
                else{
                    skip--;
                }
            });
            DBUtils.setFirstList(idlist);
            console.log(`FIRST一共有${idlist.length}个`);
            this.done();
        });
    }

}