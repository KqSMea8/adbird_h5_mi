const async = require('async');
const WebUtils = require('../utils/web');
const cheerio = require('cherio');

const typeMap = {
    '1': 'Arcade',
    '2': 'Strategy',
    '3': 'Beauty & Girl',
    '4': 'Action & Risk',
    '5': 'Adventure',
    '6': 'Music',
    '7': 'Puzzle & Logic',
    '8': 'Sports & Racing'
};

module.exports = class SpiderAll {

    constructor() {
        async.eachOfSeries(typeMap, (type, index, cb) => {
            let url = `http://mi.gameasy.top/all/category?id=${index}`;
            WebUtils.getBodyFromUrl(url).then((body) => {
                const $list = cheerio.load(body);
                $list('div.content li').each((i, elem) => {
                    let source_detail_url = 'http://mi.gameasy.top' + $list(elem).find('a').attr('href');
                    let id = source_detail_url.replace(/[a-z\/\?\=\:\.]/gi, '');
                    WebUtils.getBodyFromUrl(source_detail_url).then((detail_body) => {
                        const $ = cheerio.load(detail_body);
                        let name = $('span.name').eq(0).text();
                        let type = $('span.tag').eq(0).text();
                        let desc = $('div.desc').eq(0).text();
                        let source_game_url = `http://mi.gameasy.top/play?id=${id}`;

                        console.log(name, type, desc);
                        console.log('================');
                    });
                });
            });
        }, () => {

        });
    }

}