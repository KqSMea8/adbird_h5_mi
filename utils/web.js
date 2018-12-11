const request = require('request');
const inCom = true;

class WebUtils {

    static getBodyFromUrl(url) {
        return new Promise((resolve, reject) => {
            request(url, inCom ? { proxy: 'http://web-proxy.oa.com:8080' } : {}, (error, response, body) => {
                resolve(body);
            });
        });
    }

}

module.exports = WebUtils;