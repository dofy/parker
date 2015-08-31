var router = require('express').Router(),
    xmlParser = require('express-xml-bodyparser'),
    parser = require('../parsers'),
    xml = require('xml'),
    $ = require('../utils');

// list of best
router.route('/')
.post(xmlParser({
    explicitArray: false
}), function(req, res, next) {
    var data = req.body.xml;
    parser(data, function(content, type) {
        res.append('Content-Type', 'text/xml');
        res.send(xml({
            xml: [
                {ToUserName: {_cdata: data.FromUserName}},
                {FromUserName: {_cdata: data.ToUserName}},
                {CreateTime: +new Date()},
                {MsgType: {_cdata: type || 'text'}},
                {Content: {_cdata: content}}
            ]
        }));
    });
})
.get(function(req, res, next) {
    $.result(res, {msg: 'OK'});
});

module.exports = router;
