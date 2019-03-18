'use strict';

const async = require("async");
const {db} = require("./nodebb");

function randomExamID() {
    return new Array(8).fill(0).map(r => Math.floor(Math.random() * 36).toString(36)).join("");
}

function randomChoice(arr, count) {
    // since this will run somewhere in async chain, we can throw error as we like, it will be caught anyways
    if(count > arr.length) {
        throw new Error("count more than array length");
    }
    var a = Array.from(arr), b = [];
    for(let i=0; i<count; i++) {
        let randomIndex = Math.floor(Math.random() * a.length);
        b = b.concat(a.splice(randomIndex, 1));
    }
    return b;
}

function buildExamPaper(settings) {
    return randomChoice(settings.questions, settings.qCount).map(ques => ({
        "n" : ques.n,
        "q" : ques.q,
        "c" : ques.c,
        "m" : ques.m
    }));
}

function checkSingleAnswer(question, answer) {
    if(question.m) {
        let leftSet = question.a.split("|");
        let rightSet = answer.split(/\n/);
        return leftSet.every(item => rightSet.indexOf(item) > -1)
            && rightSet.every(item => leftSet.indexOf(item) > -1);
    }
    else if(question.r) {
        return (new RegExp(question.a, question.i ? "i" : "")).test(answer);
    }
    else if(question.i) {
        return question.a.toLowerCase() === answer.toLowerCase();
    }
    else {
        return question.a === answer;
    }
}

function markAnswer(answers, settings) {
    try {
        if(settings.qCount !== answers.length) {
            // in case of wrong answer sheet presented
            return 0;
        }
        var questions = settings.questions;
        return answers.map(answer => checkSingleAnswer(questions[answer.n], answer.a))
                      .map(result => result ? settings.eachScore : 0)
                      .reduce((total, indiScore) => total + indiScore, 0);
    }
    catch(e) {
        // in case of cheating
        return 0;
    }
}

// add a random exam ID to database and show it to user
function getExamId(callback) {
    var id = randomExamID();
    async.waterfall([
        (next) => {
            db.set('registration-exam:time' + id, Date.now(), next);
        },
        (next) => {
            db.pexpireAt('registration-exam:time' + id, Date.now() + 86400000, next);
        },
        (next) => {
            next(null, id);
        }
    ], callback);
}

// remove exam ID
function removeExamId(id, callback) {
    async.waterfall([
        (next) => {
            db.remove('registration-exam:time' + id, next);
        }
    ], callback);
}

// check if exam time is over
function checkExamTime(ansObj, callback) {
    async.waterfall([
        (next) => {
            if(!ansObj.id) {
                next({source: 'registration-exam', message: 'error'});
                return;
            }
            db.get('registration-exam:time' + ansObj.id, next);
        }
    ], callback);
}

exports.buildExamPaper = buildExamPaper;
exports.markAnswer = markAnswer;
exports.getExamId = getExamId;
exports.removeExamId = removeExamId;
exports.checkExamTime = checkExamTime;