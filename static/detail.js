(function () {

    var params = {};

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
            game: {
                name: 'GameBox',
                stars: 10
            }
        },
        computed: {
            imgIcon: function(){
                return 'url("/static/res/'+this.id+'/icon.png")';
            },
            starsStr: function(){
                return this.game.stars.toFixed(1);
            }
        }
    })

    window.jsonpGetData = function(gamedata){
        app.game = gamedata;
        app.$el.style.display = 'block';
    }

    appendScript(params.id);

})();