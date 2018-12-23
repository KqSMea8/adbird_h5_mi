//状态
var Status = {
    IDLE: 1,
    SNIFFER: 2,
    DOWNLOAD: 3,
    FINISH: 4
}

var myZipWriter = null;

new Vue({
    el: '#app',
    data: {
        status: Status.IDLE,
        filelist: [],
        url: ''
    },
    created: function () {
        this._init();
        this._listenRequest();
    },
    computed: {
        disStartBtn: function () {
            if (this.status == Status.IDLE || this.status == Status.FINISH) {
                return false;
            }
            return true;
        },
        disStopBtn: function () {
            if (this.status == Status.SNIFFER) {
                return false;
            }
            return true;
        },
        disDownloadBtn: function () {
            if (this.status == Status.IDLE && this.filelist.length) {
                return false;
            }
            return true;
        },
        downloadCount: function () {
            if (this.filelist.length) {
                let success = 0;
                this.filelist.forEach(function (file) {
                    if (file.down == 2) {
                        success++;
                    }
                });
                return `(${success}/${this.filelist.length})`;
            }
            return '';
        }
    },
    methods: {
        startSniffer: function () {
            if (this.disStartBtn) {
                return;
            }
            this.filelist = [];
            this.status = Status.SNIFFER;
            this._init();
            this._reloadTab();
        },
        stopSniffer: function () {
            if (this.disStopBtn) {
                return;
            }
            this.status = Status.IDLE;
        },
        startDownload: function () {
            if (this.disDownloadBtn) {
                return;
            }
            this.status = Status.DOWNLOAD;
            this._createZipWriter(() => {
                this._startDownload();
            });
        },
        downstatus: function (value) {
            switch (value) {
                case 0:
                    return '#333333';
                case 1:
                    return '#ff0000';
                case 2:
                    return '#02a709';
            }
        },
        _init: function () {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                // this.gameId = tabs[0].url.split('?')[1].split('=')[1];
                this.url = this._makeValidPath(tabs[0].url);
            });
        },
        _reloadTab: function () {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
            });
        },
        _listenRequest: function () {
            chrome.devtools.network.onRequestFinished.addListener((request) => {
                if (this.status == Status.SNIFFER) {
                    let url = request.request.url;
                    if (url.indexOf('http') < 0) {
                        return;
                    }
                    this.filelist.push({
                        url: url,
                        path: this._makeValidPath(url.split('?')[0]),
                        down: 0
                    });
                }
            });
        },
        _startDownload: function () {
            var self = this;
            var index = this._findDownloadFileIndex();
            if (index < 0) {
                console.error('结束了');
                this._onDownloadFinish();
                return;
            }
            var url = `${this.filelist[index].url}`;
            console.log(`开始下载: ${url}`);
            var xhr = new XMLHttpRequest();
            xhr.open("get", url, true);
            xhr.responseType = "blob";
            xhr.timeout = 10000;

            xhr.onload = function () {
                if (xhr.status == 200) {
                    var blobFile = xhr.response;
                    if (blobFile.size > 0) {
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            self._onDownloadSuccess(index, blobFile.size, event.target.result);
                        };
                        reader.readAsDataURL(blobFile);
                    }
                    else {
                        self._onDownloadFail(index);
                    }
                }
                else {
                    self._onDownloadFail(index);
                }
            }
            xhr.ontimeout = function (event) {
                self._onDownloadFail(index);
            }
            xhr.onerror = function (e) {
                self._onDownloadFail(index);
            };
            xhr.send();
        },
        _onDownloadSuccess: function (index, size, base64) {
            this.filelist[index].down = 2;
            myZipWriter.add(this.filelist[index].path, new zip.Data64URIReader(base64), () => {
                this._startDownload();
            });
        },
        _onDownloadFail: function (index) {
            this.filelist[index].down = 1;
            this._startDownload();
        },
        _onDownloadFinish: function () {
            myZipWriter.close((blob) => {

                var blobURL = URL.createObjectURL(blob);
                var downloadButton = document.getElementById("btnDownload");
                var clickEvent = document.createEvent("MouseEvent");

                clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                downloadButton.href = blobURL;
                downloadButton.download = `xxx.zip`;
                downloadButton.dispatchEvent(clickEvent);

                myZipWriter = null;
                this.status = Status.FINISH;
                // this.filelist = [];
            });
        },
        _findDownloadFileIndex: function () {
            for (var i = 0; i < this.filelist.length; i++) {
                if (!this.filelist[i].down) {
                    return i;
                }
            }
            return -1;
        },
        _createZipWriter: function (done) {
            zip.createWriter(new zip.BlobWriter(), function (writer) {
                myZipWriter = writer;
                done();
                // // use a TextReader to read the String to add
                // writer.add("filename.txt", new zip.TextReader("test!"), function () {
                //     // onsuccess callback

                //     // close the zip writer
                //     writer.close(function (blob) {
                //         // blob contains the zip file as a Blob object

                //     });
                // }, function (currentIndex, totalIndex) {
                //     // onprogress callback
                // });
            }, (error) => {
                console.error(error);
                this._startDownload();
            });
        },
        _makeValidPath(path){
            let ret = path.replace(/:/gi, '');
            let len = ret.length;
            if( ret.charAt(len-1) == '/' ){
                ret += 'index.html';
            }
            return ret;
        },
        _replaceADSense(base64) {
            let startIndex = base64.indexOf(',');
            let head = base64.substring(0, startIndex + 1);
            let data = base64.substring(startIndex + 1);
            let str = atob(data);
            str = str.replace(/https\:\/\/play\.quickgame\.top\/assets\/afg\.js\?v\=\d+/gi, 'http://game.zbkon.com/static/afg.js');
            data = btoa(str);
            return head + data;
        },
        _removeADSense(base64) {
            let startIndex = base64.indexOf(',');
            let head = base64.substring(0, startIndex + 1);
            let data = base64.substring(startIndex + 1);
            let str = atob(data);
            str = str.replace(/play\.quickgame\.top\/assets\/afg\.js\?v\=\d+/gi, '');
            str = str.replace(/imasdk\.googleapis\.com\/js\/sdkloader\/ima3\.js/gi, '');
            str = str.replace(/\<\/head\>/gi, '<script>window.QuickAds={showAfg:function(){}}</script></head>');
            data = btoa(str);
            return head + data;
        }
    }
})