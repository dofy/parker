module.exports = {
    ports: ['{{your service port}}'],
    mongo: 'mongodb://localhost/parker',
    secret: '{{cookie secret}}',
    host: '{{http://your.host/}}',
    cookie: {
        domain: '{{cookie domain}}',
        path: '/',
        maxAge: 15552000000, // 6 * 30 days
        signed: true
    },
    gugu: {
        baseurl: 'http://open.memobird.cn/home/',
        ak: '{{your_ak}}',
        memoid: '{{user_memo_id}}',
        userid: '{{userid}}'
    },
    wechat: {
        web_appid: '{{web_app_id}}',
        web_secret: '{{web_app_secret}}',
        web_url: 'https://open.weixin.qq.com/connect/qrconnect',
        appid: '{{app_id}}',
        secret: '{{secret}}',
        reurl: 'https://open.weixin.qq.com/connect/oauth2/authorize',
        snsurl: 'https://api.weixin.qq.com/sns/oauth2/access_token',
        weappurl: 'https://api.weixin.qq.com/sns/jscode2session',
        apiurl: 'https://api.weixin.qq.com/cgi-bin/',
        template: {
            alert: '{{template_id}}'
        }
    },
    weapp: {
        appid: '{{app_id}}',
        secret: '{{secret}}',
        template: {
            alert: '{{template_id}}'
        }
    },
    log: {
        appenders: [ {
            layout: {
                type: "pattern",
                pattern: "%[%d %-5p %-6c(%x{pid})%] - %m",
                tokens: {
                    pid: process.pid
                }
            },
            type: "console"
        }, {
            layout: {
                type: "pattern",
                pattern: "%d %-5p (%x{pid}) - %m",
                tokens: {
                    pid: process.pid
                }
            },
            type: "file",
            filename: "/var/log/parker/debug.log",
            category: "debug"
        }, {
            layout: {
                type: "pattern",
                pattern: "%d %-5p (%x{pid}) - %m",
                tokens: {
                    pid: process.pid
                }
            },
            type: "dateFile",
            filename: "/var/log/parker/access",
            category: "access",
            pattern: "_yyyy-MM-dd.log",
            alwaysIncludePattern: true
        } ]
    }
}
