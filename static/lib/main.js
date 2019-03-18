"use strict";

/* globals define, app, ajaxify, bootbox, socket, templates, utils */

$(document).ready(function() {
	/*
		This file shows how client-side javascript can be included via a plugin.
		If you check `plugin.json`, you'll see that this file is listed under "scripts".
		That array tells NodeBB which files to bundle into the minified javascript
		that is served to the end user.

		Some events you can elect to listen for:

		$(document).ready();			Fired when the DOM is ready
		$(window).on('action:ajaxify.end', function(data) { ... });			"data" contains "url"
	*/

	// Note how this is shown in the console on the first load of every page
});

// exam page definition part
(function() {

define('forum/exam', [], function () {

    var Exam  = {};

    Exam.init = function () {
        app.refreshTitle('[[exam:title]]');

        // assign event handlers
        assignAnswerFormEvents();
    };

    return Exam;
});

// assign events on page load
function assignAnswerFormEvents() {
    var paperID = ajaxify.data.id;
    var questions = ajaxify.data.questions;
    var time = ajaxify.data.time;
    var timer = { "time" : time, "handle" : 0 };
    questions.forEach((question, index) => {
        const baseElem = $("#exam-question-" + question.n);

        if(question.c.length > 0) {
            let optionElems = baseElem.find(".exam-question-option");
            if(question.m) {
                optionElems.each((i, elem) => {
                    $(elem).click(evtToggle.bind(null, elem));
                });
            }
            else {
                optionElems.each((i, elem) => {
                    $(elem).click(evtSelect.bind(null, optionElems, elem))
                });
            }
        }

        if(index > 0) {
            baseElem.find(".exam-prev").click(evtNext.bind(null, index-1));
        }
        if(index < questions.length - 1) {
            baseElem.find(".exam-next").click(evtNext.bind(null, index+1));
        }
        else {
            baseElem.find(".exam-submit").click(evtSubmit.bind(null, paperID, timer));
        }
    });
    $(".exam-start").click(evtStartExam.bind(null, timer));
}

// timer operations
// timer structure: {time: number, handle: number(timeout)}
function timerStart(timer) {
    if(timer.handle) {
        return;
    }
    timeTick(timer);
}

function timeTick(timer) {
    $(".exam-timer-number").html(timer.time);
    if(timer.time > 0) {
        timer.time--;
        timer.handle = setTimeout(timeTick.bind(null, timer), 1000);
    }
    else {
        examTimeUp();
    }
}

function timeStop(timer) {
    if(timer.handle) {
        clearTimeout(timer.handle);
        timer.handle = 0;
    }
}

// event handlers
function evtStartExam(timer, evt) {
    $(".exam-intro").hide(500);

    // Show timer panel & init
    $(".exam-timer-number").html(timer.time);
    $(".exam-timer").show(500, timerStart.bind(null, timer));

    // Show question panel & init
    $(".exam-questions").show(500);
    $(".exam-question").hide();
    $(".exam-question").eq(0).show();
    $(".exam-question input[type='text']").val("");
}

function evtSelect(relevantSelection, elem, evt) {
    $(relevantSelection).removeClass("exam-selected");
    $(elem).addClass("exam-selected");

    // set the button styles
    $(relevantSelection).removeClass("btn-primary");
    $(relevantSelection).addClass("btn-default");
    $(elem).removeClass("btn-default");
    $(elem).addClass("btn-primary");
}

function evtToggle(elem, evt) {
    if($(elem).hasClass("exam-selected")) {
        $(elem).removeClass("exam-selected");
        $(elem).addClass("btn-default");
        $(elem).removeClass("btn-primary");
    }
    else {
        $(elem).addClass("exam-selected");
        $(elem).removeClass("btn-default");
        $(elem).addClass("btn-primary");
    }
}

function evtNext(n, evt) {
    $(".exam-question").hide(500);
    $(".exam-question").eq(n).show(500);
}

function evtSubmit(paperID, timer, evt) {
    const api = "exam/api/submit";
    let payload = {
        id : paperID,
        answers : getAnswers()
    };
    var promise = $.ajax({
        url: api,
        type: 'POST',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(payload)
    });
    promise.then(processSubmissionResponse);
    timeStop(timer);
}

// after sending answers to server, gets server response
function processSubmissionResponse(response) {
    $(".exam-questions").hide(500);
    $(".exam-timer").hide(500);
    if(response.error) {
        $(".exam-error").html(response.message);
        $(".exam-error").show();
    }
    else if(response.result == "success") {
        $(".exam-passed").show();
        $(".exam-failed").hide();
        $(".exam-score-number").html(response.score);
        $(".exam-invitation-code").html(response.invite);
        $(".exam-invitation").show();
        $(".exam-timeup").hide();
        $(".exam-result").show(500);
    }
    else if(response.result == "fail") {
        $(".exam-passed").hide();
        $(".exam-failed").show();
        $(".exam-score-number").html(response.score);
        $(".exam-invitation").hide();
        $(".exam-timeup").hide();
        $(".exam-result").show(500);
    }
    else {
        $(".exam-questions-debug").html(JSON.stringify(response));
    }
}

// time over
// too bad
function examTimeUp() {
    $(".exam-questions").hide(500);
    $(".exam-timer").hide(500);
    $(".exam-passed").hide();
    $(".exam-failed").show();
    $(".exam-score-number").hide();
    $(".exam-invitation").hide();
    $(".exam-timeup").show();
    $(".exam-result").show(500);
}

// not really "get"
// constructs the answer object
function getAnswers() {
    var questions = ajaxify.data.questions;
    return questions.map(question => {
        const baseElem = $("#exam-question-" + question.n);
        if(question.c.length > 0) {
            // if there are more than 1 option selected, join them with linebreak
            let chosen = baseElem.find(".exam-question-option.exam-selected");
            let answer = chosen.map(function() { return $(this).html(); }).toArray().join("\n");
            return {
                "n" : question.n,
                "a" : answer === undefined ? "" : answer
            };
        }
        else {
            let answer = baseElem.find(".exam-question-input").val();
            return {
                "n" : question.n,
                "a" : answer === undefined ? "" : answer
            };
        }
    });
}

})();