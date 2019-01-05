(function () {

    var params = {
        channel: location.pathname.split('/')[1]
    };
    var likeid = [];

    //获取id
    function getParams() {
        var kvList = location.search.replace('?', '').split('&');
        kvList.forEach(function (str) {
            var kv = str.split('=');
            params[kv[0]] = kv[1];
        });
    }

    //添加脚本
    function appendScript(id) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = '/static/res/' + id + '/data.js';
        document.body.appendChild(script);
    }

    getParams();

    var app = window.app = new Vue({
        el: '#app',
        data: {
            id: params.id,
            channel: params.channel,
            game: {
                name: 'GameBox',
                stars: 10,
                like: []
            }
        },
        computed: {
            imgIcon: function () {
                return 'url("/static/res/' + this.id + '/icon.png")';
            },
            starsStr: function () {
                return this.game.stars.toFixed(1);
            }
        },
        methods: {
            getHomeUrl: function () {
                return '/' + this.channel + '/index.html';
            },
            getDetailUrl: function (id) {
                return './detail.html?id=' + id;
            },
            getPlayUrl: function(){
                return './play.html?id='+this.id;
            },
            getImgIcon: function (id) {
                return 'url("/static/res/' + id + '/icon.png")';
            },
            getShortName: function(name){
                if( name.length > 15 ){
                    return name.slice(0, 15) + '..';
                }
                return name;
            },
            jumpUrl: function(defaultId){
                try{
                    return 'detail.html?id='+(this.game.like[0].id||defaultId);
                }
                catch(err){
                    return 'detail.html?id='+defaultId;
                }
            }
        }
    })

    window.jsonpGetData = function (gamedata) {
        if (gamedata.id == params.id) {
            likeid = gamedata.like.slice(0);
            gamedata.like = [];
            app.game = gamedata;
            app.$el.style.display = 'block';
        }
        else {
            app.game.like.push(gamedata);
        }
        if (likeid.length) {
            appendScript(likeid.shift());
        }
    }

    appendScript(params.id);

})();