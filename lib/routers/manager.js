var router = require('express').Router(),
    $ = require('../utils');

router.route('/')
.get(function(req, res, next) {
    res.redirect('/y/info');
});

router.route('/:cat')
.get(function(req, res, next) {
    var cat = req.params.cat;
    // TODO: check admin
    res.render('manager-' + cat);
});

module.exports = router;
