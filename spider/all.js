const async = require('async');
const WebUtils = require('../utils/web');
const DBUtils = require('../utils/db');
const MathUtils = require('../utils/number');
const ObjectUtils = require('../utils/object');
const cheerio = require('cherio');
const fs = require('fs-extra');
const path = require('path');

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
//开启之后不再从远程加载, 只利用存量数据做校验
const NoRemoteFetch = true;

module.exports = class SpiderAll {

    constructor(done) {
        this.done = done;

        // DBUtils.setTypeList();
        // done();
        // return;

        this.gameList = [
            {
                id: 1,
                source_detail_url: 'http://mi.gameasy.top/detail?id=1'
            },
            {
                id: 2,
                source_detail_url: 'http://mi.gameasy.top/detail?id=2'
            }
        ];
        this.init();
    }

    init(){
        if( NoRemoteFetch ){
            this.checkLocal();
        }
        else{
            this.run();
        }
    }

    checkLocal(){
        DBUtils.getAllGameList().forEach((game)=>{
            if( fs.existsSync( path.resolve(__dirname, `../game/${game.id}`) ) ){
                game.source_play_url = `/game/${game.id}/index.html`;
                DBUtils.setGameDataById(game.id, game);
                this.saveToJsonp(game.id);
            }
        });
        DBUtils.saveLocal();
    }

    run(){
        async.eachOfSeries(typeMap, (type, index, cb) => {
            let url = `${host}/all/category?id=${index}`;
            WebUtils.getBodyFromUrl(url).then((body) => {
                const $list = cheerio.load(body);
                $list('div.content li').each((i, elem) => {
                    let source_detail_url = host + $list(elem).find('a').attr('href');
                    let id = source_detail_url.replace(/[a-z\/\?\=\:\.]/gi, '');
                    this.gameList.push({
                        id: id,
                        source_detail_url: source_detail_url
                    });
                });
                cb();
            });
        }, () => {
            this.parse();
        });
    }

    parse(){
        let count = 0;
        async.eachOfSeries(this.gameList, (val, index, cb)=>{
            let source_detail_url = val.source_detail_url;
            let id = val.id;
            WebUtils.getBodyFromUrl(source_detail_url).then((detail_body) => {
                const $ = cheerio.load(detail_body);
                let name = $('span.name').eq(0).text();
                let type = $('span.tag').eq(0).text();
                let desc = $('div.desc').eq(0).text();
                let source_game_url = `${host}/play?id=${id}`;
                let stars = MathUtils.float( $('i.rate').eq(0).text() );
                let plays = MathUtils.int( $('i.count').text().replace('已经玩了 ', '').replace('K+ 次', '').replace('K+ Players', '').replace(',', '') );
                let img_icon = $('.span-img img').attr('src');
                let size = '1.0MB';
                let version = '1.0';
                var updatetime = '2018-11-13';
                $('.details .items .size').each((i_, elem_)=>{
                    if( i_ == 0 ){
                        size = $(elem_).text();
                    }
                    if( i_ == 1 ){
                        version = $(elem_).text();
                    }
                    if( i_ == 2 ){
                        updatetime = $(elem_).text();
                    }
                });
                let like = [];
                $('.like li').each((i_, elem_)=>{
                    let id_ = $(elem_).find('a').attr('href').replace(/[a-z\/\?\=\:\.]/gi, '');
                    like.push( MathUtils.int(id_) );
                });

                WebUtils.getBodyFromUrl(source_game_url).then((game_body)=>{
                    const $game = cheerio.load(game_body);
                    let source_play_url = WebUtils.minPlayUrl( id, $game('object.game').attr('data') );
                    //下载icon
                    let iconfile = path.resolve(__dirname, `../static/res/${id}/icon.png`);
                    fs.ensureFileSync(iconfile);
                    // console.log(id, name, type, desc, source_detail_url, source_game_url, source_play_url, stars, plays, img_icon, size, like, version, updatetime);
                    WebUtils.download(img_icon, iconfile).then(()=>{
                        DBUtils.setGameData(id, name, type, desc, source_detail_url, source_game_url, source_play_url, stars, plays, img_icon, size, like, version, updatetime);
                        setTimeout(()=>{
                            //整理到jsonp资源
                            this.saveToJsonp(id);
                            console.log(`${++count} - ${id} - ${name}`);
                            cb();
                        }, 100);
                    });
                });
            });
        }, ()=>{
            DBUtils.setTypeList();
            this.done();
        });
    }

    saveToJsonp(id){
        let jsonpfile = path.resolve(__dirname, `../static/res/${id}/data.js`);
        let gamedata = DBUtils.getGameById(id);
        let gameinfo = ObjectUtils.clone(gamedata);
        delete gameinfo.img_icon;
        delete gameinfo.source_detail_url;
        delete gameinfo.source_game_url;
        fs.ensureFileSync(jsonpfile);
        fs.writeFileSync(jsonpfile, `jsonpGetData(${JSON.stringify(gameinfo)});`);
    }

}