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
            if( uri.slice(0,2) == '//' ){
                uri = 'http:'+uri;
            }
            request(uri, config).pipe(fs.createWriteStream(filename)).on('close', () => {
                resolve();
            }).on('error', (err)=>{
                
            })
           
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