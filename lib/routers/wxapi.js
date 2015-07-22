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
    $.info(data);
    res.append('Content-Type', 'text/xml');
    res.send(xml({
        xml: [
            {ToUserName: {_cdata: data.FromUserName}},
            {FromUserName: {_cdata: data.ToUserName}},
            {CreateTime: +new Date()},
            {MsgType: {_cdata: 'text'}},
            {Content: {_cdata: require('../parsers')(data)}}
        ]
    }));
})
.get(function(req, res, next) {
    $.result(res, {msg: 'OK'});
});

module.exports = router;
