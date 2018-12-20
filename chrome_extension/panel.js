//状态
var Status = {
    IDLE: 1,
    SNIFFER: 2,
    DOWNLOAD: 3
}

var hostbase = 'https://play.okeyplay.com';
var myZipWriter = null;

new Vue({
    el: '#app',
    data: {
        status: Status.IDLE,
        filelist: [],
        gameName: null,
        gameId: 0
    },
    created: function () {
        this._init();
        this._listenRequest();
    },
    computed: {
        disStartBtn: function () {
            if (this.status == Status.IDLE) {
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
            this.filelist = [];
            this.status = Status.SNIFFER;
            this._init();
            this._reloadTab();
        },
        stopSniffer: function () {
            this.status = Status.IDLE;
        },
        startDownload: function () {
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
                this.gameId = tabs[0].url.split('?')[1].split('=')[1];
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
                    if (url.indexOf(hostbase) < 0) {
                        return;
                    }
                    url = url.replace(`${hostbase}/`, '');
                    if (!this.gameName) {
                        this.gameName = url.split('/')[0]
                    }
                    url = url.replace(`${this.gameName}/`, '');
                    this.filelist.push({
                        url: url,
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
            var url = `${hostbase}/${this.gameName}/${this.filelist[index].url}`;
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
            myZipWriter.add(this.filelist[index].url, new zip.Data64URIReader(base64), () => {
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
                downloadButton.download = `${this.gameId}.zip`;
                downloadButton.dispatchEvent(clickEvent);

                myZipWriter = null;
                this.status = Status.IDLE;
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
            }, function (error) {
                // onerror callback
            });
        }
    }
})