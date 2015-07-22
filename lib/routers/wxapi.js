var router = require('express').Router(),
    xmlParser = require('express-xml-bodyparser'),
    $ = require('../utils');

// list of best
router.route('/')
.post(xmlParser({
    explicitArray: false
}), function(req, res, next) {
    $.result(res, req.body);
})
.get(function(req, res, next) {
    $.result(res, {msg: 'OK'});
});

module.exports = router;
