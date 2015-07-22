module.exports = {
    ports: [7777],
    mongo: 'mongodb://localhost/parker',
    secret: '.THE-GEEK-PARKER-IN-THE-PARK.',
    cookie: {
        domain: 'parker.geeks.vc',
        path: '/',
        maxAge: 15552000000, // 6 * 30 days
        signed: true
    },
    oauth: {
        weixin: {
            appid: 'wx2d55113ff275100c',
            secret: '3034cce6c772058ebf781671f80446af',
            baseurl: 'https://api.weixin.qq.com/cgi-bin/',
            apiurl: 'https://api.weixin.qq.com/cgi-bin/',
            authurl: 'authorize',
            tokenurl: 'token',
            callback: 'http://parker.geeks.vc/wxapi/callback'
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
