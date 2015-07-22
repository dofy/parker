var router = require('express').Router(),
    $ = require('../utils');

// list of best
router.route('/')
.get(function(req, res, next) {
    $.result(res, {msg: 'OK'});
});

module.exports = router;
