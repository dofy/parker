var router = require('express').Router();

router.route('/')
  .get(function(req, res, next) {
    // wechat echostr
    res.send(req.query['echostr']);
  });

module.exports = router;
