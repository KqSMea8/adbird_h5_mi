(function () {

    var params = {
        channel: location.pathname.split('/')[1]
    };

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

    //菜单
    function initMenu(){
        var menu = document.getElementById('menu');
        var setting = document.getElementById('setting');
        menu.addEventListener('click', function(){
            setting.style.display = setting.style.display=='block' ? 'none' : 'block';
        });
    }

    window.jsonpGetData = function (gamedata) {
        document.getElementById('game').setAttribute('data', gamedata.source_play_url);
    }

    getParams();
    initMenu();
    appendScript(params.id);

})();