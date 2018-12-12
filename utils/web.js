const request = require('request');
const fs = require('fs-extra');
const config = { proxy: 'http://web-proxy.oa.com:8080' };
// const config = {};

class WebUtils {

    static getBodyFromUrl(url) {
        return new Promise((resolve, reject) => {
            request(url, config, (error, response, body) => {
                resolve(body);
            });
        });
    }

    static download(uri, filename) {
        return new Promise((resolve, reject) => {
            request.head(uri, function (err, res, body) {
                // console.log('content-type:', res.headers['content-type']);
                // console.log('content-length:', res.headers['content-length']);
                request(uri, config).pipe(fs.createWriteStream(filename)).on('close', ()=>{
                    resolve();
                });
            });
        });
    };

    static minPlayUrl(url){
        return encodeURIComponent( url.split('?')[0].replace('https://play.okeyplay.com', '') );
    }

}

module.exports = WebUtils;