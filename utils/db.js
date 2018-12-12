const fs = require('fs-extra');
const chalk = require('chalk');
const MathUtils = require('./web');

class DBUtils {

    constructor() {
        this.db = fs.readJsonSync('./sqlite/allgames.json');
        this.nowList = null;
        this.hotList = null;
        this.keyMap = {};
        this.db.forEach((val, index) => {
            this.keyMap[val.id] = index;
        });
    }

    saveLocal() {
        fs.writeFileSync('./sqlite/allgames.json', JSON.stringify(this.db, null, 4));
    }

    isGameExists(id) {
        return !!this.db[id];
    }

    setGameData(id, name, type, desc, source_detail_url, source_game_url, source_play_url, stars, plays, img_icon, size, like, version, updatetime) {
        let index = this.keyMap[id];
        let data = {
            id: id,
            name: name,
            type: type,
            desc: desc,
            portrait: true,
            is3d: false,
            source_detail_url: source_detail_url,
            source_game_url: source_game_url,
            source_play_url: source_play_url,
            stars: stars,
            plays: plays,
            img_icon: img_icon,
            img_banner: '',
            size: size,
            like: like,
            version: version,
            updatetime: updatetime
        };
        if (index >= 0) {
            this.db[index] = data;
        }
        else {
            this.db.push(data);
            this.keyMap[id] = this.db.length - 1;
        }
        this.saveLocal();
    }

    setTypeList(){
        let typeList = {};
        this.db.forEach((val, index) => {
            typeList[val.type] = true;
        });
        fs.writeFileSync('./sqlite/type.json', JSON.stringify(Object.keys(typeList)));
    }

    setNowList(list){
        fs.writeFileSync('./sqlite/now.json', JSON.stringify(list));
    }

    setHotList(list){
        fs.writeFileSync('./sqlite/hot.json', JSON.stringify(list));
    }

    setFirstList(list){
        fs.writeFileSync('./sqlite/first.json', JSON.stringify(list));
    }

    getGameById(id){
        let index = this.keyMap[id];
        let ret = this.db[index];
        if( !ret ){
            console.log( chalk(`没有找到游戏数据id=${id}`) );
        }
        ret.source_play_url = MathUtils.minPlayUrl(ret.source_play_url);
        return ret;
    }

    getChannelList(){
        return fs.readJsonSync('./sqlite/channel.json')
    }

    getNowList(){
        if( this.nowList ){
            return this.nowList;
        }
        let idlist = fs.readJsonSync('./sqlite/now.json');
        let ret = [];
        idlist.forEach((id)=>{
            ret.push( this.getGameById(id) );
        });
        this.nowList = ret;
        return this.nowList;
    }

    getHotList(){
        if( this.hotList ){
            return this.hotList;
        }
        let idlist = fs.readJsonSync('./sqlite/hot.json');
        let ret = [];
        idlist.forEach((id)=>{
            ret.push( this.getGameById(id) );
        });
        this.hotList = ret;
        return this.hotList;
    }

    getTypes(type){
        return fs.readJsonSync('./sqlite/type.json')
    }

    getTypeList(type){
        let ret = [];
        let gamelist = fs.readJsonSync('./sqlite/allgames.json');
        gamelist.forEach((game)=>{
            if( game.type == type ){
                ret.push( this.getGameById(game.id) );
            }
        });
        return ret;
    }

    getTypeListFromFirst(type){
        let ret = [];
        let idlist = fs.readJsonSync('./sqlite/first.json');
        idlist.forEach((id)=>{
            let game = this.getGameById(id);
            if( game.type == type ){
                ret.push( game );
            }
        });
        return ret;
    }

}

module.exports = new DBUtils();