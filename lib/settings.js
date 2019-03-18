'use strict';

const {db, meta} = require("./nodebb");
const {defaultSettings} = require("./defaults");

var Settings = {};

/* questions: n - index, q - question message, c - choices, a - answer, r - use regex, m - multichoose, i - case insensitive */

function convertSettings(savedSettings) {
    let sett = {};
    ["timeLimit", "extraTime", "qCount", "eachScore", "needScore", "inviExpire", "ipDayLimit"].forEach(tag => {
        let val = parseInt(savedSettings[tag], 10);
        sett[tag] = isNaN(val) ? defaultSettings[tag] : val;
    });
    try {
        sett.questions = JSON.parse(savedSettings.questionsStr);
        // assert it is an array
        if(!sett.questions instanceof Array) { throw 0; }
    }
    catch(e) {
        sett.questions = defaultSettings.questions;
    }
    return sett;
}

Settings.load = function(next) {
    var sett = meta.settings.get('registration-exam', (err, results) => {
        if(err) {
            next(null, defaultSettings);
        }
        else {
            next(null, convertSettings(results));
        }
    });
}

module.exports = Settings;