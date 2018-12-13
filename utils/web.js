const request = require('request');
const fs = require('fs-extra');
const path = require('path');
const minify = require('html-minifier').minify;
const config = { proxy: 'http://web-proxy.oa.com:8080' };

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
                request(uri, config).pipe(fs.createWriteStream(filename)).on('close', () => {
                    resolve();
                });
            });
        });
    };

    static minPlayUrl(id, url) {
        if( fs.existsSync( path.resolve(__dirname, `../game/${id}`) ) ){
            return `/game/${id}/index.html`;
        }
        else{
            return url.split('?')[0];
        }
    }

    static minHtml(html) {
        return minify(html, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
            decodeEntities: true
        });
    }

}

module.exports = WebUtils;