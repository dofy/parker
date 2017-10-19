const router = require('express').Router();
const user = require('../models/user');
const $ = require('../utils');

router.route('/')
  .get(function(req, res, next) {
    // wechat echostr
    res.send(req.query['echostr']);
  });

router.route('/login/:code')
  .post((req, res, next) => {
    let userInfo = req.body;
    $.weapp.getOpenId(req.params.code, (result) => {
      userInfo.unionid = result.unionid;
      user.findOne({unionid: result.unionid}, (err, result) => {
        if (!result) {
          $.result(res, 'no unionid.', $.errCode.NO_PERMISSIONS);
        } else {
          $.result(res, userInfo);
        }
      })
    })
  })

module.exports = router;
