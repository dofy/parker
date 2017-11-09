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
  .post((req, res, next) => {
    let user = req.body.user;
    let room = req.params.id;
    let date = new Date().getFullYear() + '/' + req.body.date;
    let range = req.body.range.split(',');
    let formid = req.body.formid;

    meeting.getRange(room, date, user, (err, result) => {
      if(result.some(item => range.indexOf(item) >= 0)) {
        $.result(res, 'time error', $.errCode.UNKNOW_ERROR)
      } else {
        meeting.create({
          room, user, date, range, formid
        }, (err, result) => {
          $.result(res, result);
        });
      }
    });
  })
  .get((req, res, next) => {
    let room = req.params.id;
    let date = new Date().getFullYear() + '/' + req.query.date;
    let user = req.query.user;
    meeting.getRange(room, date, user, (err, range) => {
      $.result(res, range);
    });
  });

// 取消预约
router.route('/meeting/:id')
  .delete((req, res, next) => {
    let _id = req.params.id;
    let user = req.body.user;
    meeting.remove({
      _id, user
    }, (err, result) => {
      $.result(res, {msg: 'ok'});
    })
  })

// 我的预约
router.route('/meetings/:user')
  .get((req, res, next) => {
    let user = req.params.user;
    meeting.find({
      user
    }).sort({
      date: -1,
      range: -1
    }).populate('room').exec((err, result) => {
      $.result(res, result);
    })
  })

// 登录 获取用户信息
router.route('/login/:code')
  .post((req, res, next) => {
    let userInfo = req.body;
    $.weapp.getOpenId(req.params.code, (result) => {
      user.findOne({unionid: result.unionid}, (err, dUser) => {
        if (!dUser) {
          $.result(res, 'no unionid.', $.errCode.NO_PERMISSIONS);
        } else {
          user.sync({
            appopenid: result.openid,
            unionid: result.unionid
          });
          userInfo._id = dUser._id;
          $.result(res, userInfo);
        }
      })
    })
  });

module.exports = router;
