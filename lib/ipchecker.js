'use strict';

const async = require("async");
const {db} = require("./nodebb");

function checkIP(ip, max, callback) {
    async.waterfall([
        (next) => {
            db.get("registration-exam:ip:" + ip, (err, result) => {
                if(err || !result || isNaN(parseInt(result, 10))) {
                    next(null, 0);
                }
                else {
                    let realResult = parseInt(result, 10);
                    if(realResult < max) {
                        next(null, realResult);
                    }
                    else {
                        next({source: 'registration-exam', message: 'daily submission limit reached'})
                    }
                }
            });
        },
        (count, next) => {
            db.set("registration-exam:ip:" + ip, count + 1, next);
        },
        (next) => {
            db.pexpireAt("registration-exam:ip:" + ip, Date.now() + 86400000, next);
        }
    ], callback);
}

exports.checkIP = checkIP;