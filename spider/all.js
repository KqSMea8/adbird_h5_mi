const async = require('async');
const WebUtils = require('../utils/web');
const DBUtils = require('../utils/db');
const MathUtils = require('../utils/number');
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
const host = 'http://mi.gameasy.top';

module.exports = class SpiderAll {

    constructor(done) {
        this.done = done;
        this.init();
    }

    init(){
        this.run();
    }

    run(){
        let count = 0;
        async.eachOfSeries(typeMap, (type, index, cb) => {
            let url = `${host}/all/category?id=${index}`;
            WebUtils.getBodyFromUrl(url).then((body) => {
                const $list = cheerio.load(body);
                $list('div.content li').each((i, elem) => {
                    let source_detail_url = host + $list(elem).find('a').attr('href');
                    let id = source_detail_url.replace(/[a-z\/\?\=\:\.]/gi, '');

                    WebUtils.getBodyFromUrl(source_detail_url).then((detail_body) => {
                        const $ = cheerio.load(detail_body);
                        let name = $('span.name').eq(0).text();
                        let type = $('span.tag').eq(0).text();
                        let desc = $('div.desc').eq(0).text();
                        let source_game_url = `${host}/play?id=${id}`;
                        let stars = MathUtils.float( $('i.rate').eq(0).text() );
                        let plays = MathUtils.int( $('i.count').text().replace('已经玩了 ', '').replace('K+ 次', '').replace('K+ Players', '') );
                        let img_icon = $('.span-img img').attr('src');
                        let size = $('span.players i').eq(3).text();

                        WebUtils.getBodyFromUrl(source_game_url).then((game_body)=>{
                            const $game = cheerio.load(game_body);
                            let source_play_url = $game('object.game').attr('data')

                            DBUtils.setGameData(id, name, type, desc, source_detail_url, source_game_url, source_play_url, stars, plays, img_icon, size);
                            console.log(`${++count} - ${name}`);
                        });
                    });
                });
                cb();
            });
        }, () => {
            this.done();
        });
    }

}