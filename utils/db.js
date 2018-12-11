const fs = require('fs-extra');

class DBUtils {

    constructor() {
        this.db = fs.readJsonSync('./sqlite/allgames.json');
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

    setGameData(id, name, type, desc, source_detail_url, source_game_url, stars, plays, img_icon, size) {
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
            stars: stars,
            plays: plays,
            img_icon: img_icon,
            img_banner: '',
            size: size
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

}

module.exports = new DBUtils();