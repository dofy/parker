var router = require('express').Router(),
    xmlParser = require('express-xml-bodyparser'),
    xml = require('xml'),
    $ = require('../utils');

// list of best
router.route('/')
.post(xmlParser({
    explicitArray: false
}), function(req, res, next) {
    var data = req.body.xml;
    res.writeHead(200, {"Content-Type": "text/xml"});
    res.write(xml({
        xml: [
            {ToUserName: {_cdata: data.FromUserName}},
            {FromUserName: {_cdata: data.ToUserName}},
            {CreateTime: +new Date()},
            {MsgType: {_cdata: 'text'}},
            {Content: {_cdata: data.Content}}
        ]
    }));
    res.end();
})
.get(function(req, res, next) {
    $.result(res, {msg: 'OK'});
});

module.exports = router;
