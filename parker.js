var express = require('express'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    $ = require('./lib/utils'),
    Job = require('./lib/job'),
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
    app.use('/test', require('./lib/routers/test'));

    app.get('/*', function(req, res) {
        $.result(res, 'URI_NOT_FOUND', $.errCode.URI_NOT_FOUND, 403);
    });

    // run jobs
    Job.basePath = $.path.join(__dirname, 'jobs');
    //Job.register('alert');

    //Job.tick('alert');

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
