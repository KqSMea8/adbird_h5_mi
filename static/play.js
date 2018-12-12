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

    //开始游戏
    function startGame(){
        var url = decodeURIComponent(params.url);
        if( url.indexOf('http') < 0 ){
            url = 'https://play.okeyplay.com' + url;
        }
        document.getElementById('game').setAttribute('data', url);
    }

    getParams();
    startGame();

})();