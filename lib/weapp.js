const request = require('request');
const config = require('./config');

// TODO: merge wechat & weapp

let accessToken, expires = 0;

function getOpenId(code, callback) {
    request.get(config.wechat.weappurl, {
        qs: {
            grant_type: 'authorization_code',
            js_code: code,
            appid: config.weapp.appid,
            secret: config.weapp.secret
        }
    }, function(err, res, body) {
        var body = JSON.parse(body);
        callback && callback(body);
    });
}

function getAccessToken(next) {
    request.get(config.wechat.apiurl + 'token', {
        qs: {
            grant_type: 'client_credential',
            appid: config.weapp.appid,
            secret: consig.weapp.secret
        }
    }, function(err, res, body) {
        var body = JSON.parse(body);
        accessToken = body.access_token;
        expires = +new Date() + body.expires_in * 1000;
        next && next();
    });
}

function checkAccessToken(next) {
    if(+new Date() >= expires) {
        getAccessToken(next);
    } else {
        next();
    }
}

function sendByTemplate(openid, formid, tmpid, data) {
    checkAccessToken(function() {
      request.post(config.wechat.apiurl + 'message/wxopen/template/send', {
            qs: {
                access_token: accessToken
            },
            json: true,
            body: {
                touser: openid,
                form_id: formid,
                template_id: tmpid,
                data: data
            }
        });
    });
}

module.exports = {
  getOpenId,
  sendByTemplate
};
