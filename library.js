"use strict";

var controllers = require('./lib/controllers'),

	plugin = {};

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;

	function renderGlobal(req, res, next) {
		Config.getTemplateData(function(data) {
			res.render(Config.plugin.id, data);
		});
	}

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/exam', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/exam', controllers.renderAdminPage);

	// new middlewares

	// get paper is unused in this version
	// router.get('/exam/api/get_paper', controllers.renderGetPaper);
	router.post('/exam/api/submit', controllers.renderSubmit);

	// Cancelling is unneeded in this version
	// router.post('/exam/api/cancel_exam', controllers.renderCancelExam);
	router.get('/exam', params.middleware.buildHeader, controllers.renderExam);

	callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/exam',
		icon: 'fa-tint',
		name: 'Registration Exam'
	});

	callback(null, header);
};

plugin.addInvitationInput = function(params, callback) {
	// hook:register.build
	var captcha = {
		label: '[[exam:register-info]] (<a href="exam" target="_blank">[[exam:exam-link]]</a>)',
		html: '<input class="form-control" name="exam-invitation-input" id="exam-invitation-input" /><br />'
	};

	if (params.templateData.regFormEntry && Array.isArray(params.templateData.regFormEntry)) {
		params.templateData.regFormEntry.push(captcha);
	} else {
		params.templateData.captcha = captcha;
	}

	callback(null, params);
};

plugin.checkRegister = function(params, callback) {
	// hook:register.check

	controllers.checkRegister(params.req.body['exam-invitation-input'], (err, result) => {
		if (result !== "success" || err) {
			callback({source: 'registration-exam', message: '[[exam:bad-invitation-code]]'}, params);
		} else {
			callback(null, params);
		}
	})
};

module.exports = plugin;