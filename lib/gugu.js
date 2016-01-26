var request = require('request'),
    iconv = require('iconv-lite');

var baseurl, ak, memoid, userid,
    apiid;

var isReady = false;

exports = module.exports = init;

function init(options) {
    isReady = false;

    baseurl = options.baseurl;
    memoid = options.memoid;
    userid = options.userid;
    ak = options.ak;

    setuserbind();
}

function setuserbind() {
    baseRequest('setuserbind', {
        memobirdID: memoid,
        useridentifying: userid
    }, function(data) {
        isReady = true;
        apiid = data.showapi_userid;
    });
}

function printpaper(contents) {
    if(!isReady) {
        return false;
    }
    if(typeof contents === 'string') {
        contents = [contents];
    }
    contents = contents.join('\n') + '\n';
    baseRequest('printpaper', {
        printcontent: 'T:' + iconv.encode(contents, 'gbk').toString('base64'),
        memobirdID: memoid,
        userID: apiid
    }, function(data) {
        console.log(data);
    });
}

function getprintstatus() {
    if(!isReady) {
        return false;
    }
}

function baseRequest(action, body, callback) {
    request.post(baseurl + action, {
        qs: {
            ak: ak,
            timestamp: new Date()
        },
        json: true,
        body: body
    }, function(err, res, body) {
        callback && callback(body);
    });
}

exports.printpaper = printpaper;
