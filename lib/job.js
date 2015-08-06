var CronJob = require('cron').CronJob,
    path = require('path'),
    jobDict = {};

var Job = {
    basePath: __dirname,
    register: function(job) {
        var jobPath = path.join(this.basePath, job);
        try {
            var jobBody = require(jobPath);
            jobBody.name = jobBody.name || job;
            if(jobDict.hasOwnProperty(jobPath)) {
                jobDict[jobPath].jobCron.stop();
                console.log('<SYS> [ %s ] is replaced.', jobBody.name);
            } else {
                console.log('<JOB> [ %s ] is registered.', jobBody.name);
            }
            // init job
            jobBody.init && jobBody.init();
            // register job
            jobDict[jobPath] = {
                jobBody: jobBody,
                jobCron: new CronJob({
                    cronTime: jobBody.time,
                    onTick: jobBody.tick,
                    start: true
                })
            };
        } catch (err) {
            console.log('<JOB> [ %s ] %s', job, err);
        }
    },
    tick: function(job) {
        var jobPath = path.join(this.basePath, job);
        if(jobDict.hasOwnProperty(jobPath)) {
            console.log('<HIT> [ %s ] ticked.', jobDict[jobPath].jobBody.name);
            jobDict[jobPath].jobBody.tick();
        } else {
            console.log('<FLD> [ %s ] is not registered.', job);
        }
    },
    showInfo: function() {
        var ind = 0;
        console.log('====================================');
        console.log('|-.-| ~ QList Queue Job Info ~ |-.-|');
        console.log('------------------------------------');
        for(var key in jobDict) {
            console.log('%d. [ %s ] %s', ++ind, jobDict[key].jobBody.name, jobDict[key].jobBody.time);
        }
        console.log('====================================');
    },
    stopAll: function() {
        for(var key in jobDict) {
            jobDict[key].jobCron.stop();
            console.log('<SYS> [ %s ] is stoped.', jobDict[key].jobBody.name);
        }
        console.log('<SYS> All jobs are stoped.');
    }
};

module.exports = Job;
