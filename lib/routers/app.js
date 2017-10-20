const router = require('express').Router();
const user = require('../models/user');
const meeting = require('../models/meeting');
const order = require('../models/order');
const room = require('../models/room');
const $ = require('../utils');

// 小程序后台验证
router.route('/')
  .get(function(req, res, next) {
    // wechat echostr
    res.send(req.query['echostr']);
  });

// 获取房间列表
router.route('/rooms')
  .get((req, res, next) => {
    room.find().exec((err, result) => {
      $.result(res, result);
    })
  });

// 会议信息
router.route('/room/:id')
  .get((req, res, next) => {
    meeting.find({_id: req.params.id}, (err, result) => {
      $.result(res, result);
    })
  })

// 登录 获取用户信息
router.route('/login/:code')
  .post((req, res, next) => {
    let userInfo = req.body;
    $.weapp.getOpenId(req.params.code, (result) => {
      userInfo.unionid = result.unionid;
      user.findOne({unionid: result.unionid}, (err, result) => {
        if (!result) {
          $.result(res, 'no unionid.', $.errCode.NO_PERMISSIONS);
        } else {
          userInfo._id = result._id;
          $.result(res, userInfo);
        }
      })
    })
  });

module.exports = router;
