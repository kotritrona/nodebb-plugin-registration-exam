'use strict';

var Controllers = {};
const async        = require('async'),
      Questions    = require('./questions'),
      Invitations  = require('./invitations'),
      Settings     = require('./settings'),
      IPChecker    = require('./ipchecker'),
	  {meta} = require('./nodebb');

Controllers.renderAdminPage = function (req, res, next) {
	/*
		Make sure the route matches your path to template exactly.

		If your route was:
			myforum.com/some/complex/route/
		your template should be:
			templates/some/complex/route.tpl
		and you would render it like so:
			res.render('some/complex/route');
	*/

    async.waterfall([
        initSettings,
        (settings, next) => {
            let settingsNew = Object.assign({}, settings);
            settingsNew.questions = settings.questions.map(ques => {
                return {
                    "c": ques.c.join("\n").replace(/\"/g, "&quot;"),
                    "q": ques.q.replace(/\"/g, "&quot;"),
                    "a": ques.a.replace(/\"/g, "&quot;"),
                    "n": ques.n,
                    "m": ques.m,
                    "r": ques.r,
                    "i": ques.i
                };
            })
            if(settingsNew.questions.length == 0) {
                settingsNew.questions.push({
                    "c": "",
                    "q": "",
                    "a": "",
                    "n": 0,
                    "m": false,
                    "r": false,
                    "i": false
                });
            }
            res.render('admin/plugins/exam', settingsNew);
        }
    ]);
};

// middleware for /exam
Controllers.renderExam = function(req, res, next) {
	var settings;
	async.waterfall([
		initSettings,
		(sett, next) => {
			settings = sett;
			getExamPaper(settings, next);
		}
	], (err, result) => {
		if(err) {
			res.render('exam', {"error" : err});
		}
		else {
			res.render('exam', {
                "time"        : settings.timeLimit,
				"timeMinutes" : Math.floor(settings.timeLimit / 60),
				"maxScore"    : settings.qCount * settings.eachScore,
				"needScore"   : settings.needScore,
				"id"          : result.id,
				"questions"   : result.questions,
			});
		}
	});
};

// middleware for /api/get_paper
Controllers.renderGetPaper = function (req, res, next) {
    let settings = {};
	async.waterfall([
        initSettings,
        (result, next) => {
            settings = result;
            next(null);
        },
		(next) => {
			getExamPaper(settings, next);
		}
	], (err, result) => {
		if(err) {
			res.send(Object.assign(err, {
				"result" : "error"
			}));
		}
		else {
			res.send(Object.assign(result, {
				"result" : "success"
			}));
		}
	});
};

// middleware for /api/submit
Controllers.renderSubmit = function(req, res, next) {
	async.waterfall([
		(next) => {
			checkExamResult(req, next);
		}
	], (err, result) => {
		if(err) {
			res.send(Object.assign(err, {"error" : true}));
		}
		else {
			res.send(result);
		}
	});
};

// middleware for /api/cancel_exam (currently unused)
Controllers.renderCancelExam = function(req, res, next) {
	console.log(req.body);
	var reqBody = req.body;
	async.waterfall([
		(next) => {
			cancelExam(reqBody.id, next);
		}
	], (err, result) => {
		if(err) {
			res.send(err);
		}
		else {
			res.send(result);
		}
	});
};

function initSettings(next) {
	Settings.load(next);
};

// for /api/get_paper (currently unused), and before exam_start
function getExamPaper(settings, callback) {
	async.waterfall([
		Questions.getExamId,
		(id, next) => {
			next(null, {
				"id" : id,
				"questions" : Questions.buildExamPaper(settings)
			});
		}
	], callback);
};

// for /api/cancel_exam
function cancelExam(id, callback) {
	async.waterfall([
		(next) => {
			Questions.removeExamId(id, next);
		}
	], callback);
};

// for /api/submit
function checkExamResult(req, callback) {
	var settings = {}, ansObj = req.body;
    async.waterfall([
		initSettings,
		(result, next) => {
			settings = result;
			next(null);
		},
        (next) => {
            // ip limit
            if(settings.ipDayLimit > 0) {
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                IPChecker.checkIP(ip, settings.ipDayLimit, next);
            }
            else {
                next(null);
            }
        },
        (next) => {
            // read exam starting time from DB
            Questions.checkExamTime(ansObj, next);
        },
        (dbTime, next) => {
            // check if time is over
            // in case of network lag, add a 60 sec extra time window
            if(dbTime > 0 && Date.now() > dbTime + (settings.timeLimit + settings.extraTime) * 1000) {
                next({source: 'registration-exam', message: 'error'}, {
                    "result" : "timeup"
                });
            }
            else {
                next(null);
            }
        },
        (next) => {
            next(null);
        },
        (next) => {
        	// mark the answer
            var mark = Questions.markAnswer(ansObj.answers, settings);

            // if score is high enough, go get an invitation code
            if(mark > settings.needScore) {
                var invitationID = Invitations.randomInvitationString();
                Invitations.setDBInvitation(invitationID, settings.inviExpire * 3600000, err => {
	                next(err, {
	                    "result" : "success",
	                    "invite" : invitationID,
	                    "score"  : mark
	                });
                });
            }
            else {
                next(null, {
                    "result" : "fail",
                    "score"  : mark
                });
            }
        }
    ], callback);
};

// for register check
function checkRegister(code, callback) {
    async.waterfall([
        (next) => {
            Invitations.checkDBInvitation(code, next);
        },
        (result, next) => {
            if(result) {
                next(null, "success");
                // remove the invite code in true async
                Invitations.removeDBInvitation(code, () => 0);
            }
            else {
                next(null, "failure");
            }
        }
    ], callback);
}

Controllers.initSettings = initSettings;
Controllers.getExamPaper = getExamPaper;
Controllers.cancelExam = cancelExam;
Controllers.checkExamResult = checkExamResult;
Controllers.checkRegister = checkRegister;

module.exports = Controllers;