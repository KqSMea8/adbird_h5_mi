const async = require('async');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const DBUtils = require('../utils/db');
const WebUtils = require('../utils/web');

class CheckGame {

    constructor() {
        async.eachOfSeries(DBUtils.getAllGameList(), (game, index, cb) => {
            if( this.isLocalGameExists(game) ){
                DBUtils.getGamePlayUrl(game.id);
            }
            cb();
        }, () => {
            
        })
    }

    isLocalGameExists(game){
        return fs.existsSync( path.resolve(__dirname, `../game/${game.id}`) );
    }

}

new CheckGame();