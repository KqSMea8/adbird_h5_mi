const request = require('request');
const fs = require('fs-extra');
const path = require('path');
const minify = require('html-minifier').minify;
// const config = { proxy: 'http://web-proxy.oa.com:8080', timeout: 5000 };
const config = { timeout: 5000 };

class WebUtils {

    static getBodyFromUrl(url) {
        return new Promise((resolve, reject) => {
            request(url, config, (error, response, body) => {
                resolve(body);
            });
        })
        .catch(error => console.log('caught', error.message))
    }

    static download(uri, filename) {
        return new Promise((resolve, reject) => {

            if( fs.existsSync(filename) && fs.statSync(filename).size > 10 ){
                resolve();
                return;
            }
            // console.log(1111111, uri);
            // request.head(uri, function (err, res, body) {
                // console.log(22222222, err, res);
                // console.log('content-type:', res.headers['content-type']);
                // console.log('content-length:', res.headers['content-length']);
                request(uri, config).pipe(fs.createWriteStream(filename)).on('close', () => {
                    resolve();
                }).on('error', (err)=>{
                    // console.log(3333333, err);
                })
            // });
        })
        .catch(error => console.log('caught', error.message))

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