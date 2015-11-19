var express = require('express'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    jade = require('jade'),
    $ = require('./lib/utils'),
    job = require('./lib/job'),
    app = express();

$.mongo.connect($.config.mongo, function(err) {
    if (err) {
        $.error(err);
        process.exit(0);
    } else {
        start();
    }
});

function start() {
    app.set('views', path.join(__dirname, 'lib/views'));
    app.set('view engine', 'jade');

    app.use(compression({
        threshold: 512
    }));

    app.use($.logAccess);

    app.use(cookieParser($.config.secret));

    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(bodyParser.json());

    app.use(express.static('static', {
        index: false,
        maxAge: '7 days'
    }));

    app.use('/wxapi', require('./lib/routers/wxapi'));
    app.use('/z', require('./lib/routers/admin'));

    app.get('/*', function(req, res) {
        $.result(res, 'URI_NOT_FOUND', $.errCode.URI_NOT_FOUND, 403);
    });

    // run jobs
    job.basePath = $.path.join(__dirname, 'jobs');
    job.register('lunch');
    job.register('dinner');
    job.register('sync');

    //job.tick('sync');

    // set log level
    // util.setLevel('ERROR');

    $.error('=====================================================');
    $.error('==    |-.-|    GEEK PARKER API SERVICE    |-.-|    ==');
    $.error('=====================================================');
    $.error('==    Started at ' + new Date().toUTCString() + '     ==');
    $.error('=====================================================');

    var port;
    while(port = $.config.ports.pop()) {
        app.listen(port);
    }
}
