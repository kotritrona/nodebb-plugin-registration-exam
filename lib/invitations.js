'use strict';

const async = require('async'),
      {db} = require('./nodebb');

function randomInvitationString() {
    return new Array(8).fill(0).map(r => Math.floor(Math.random() * 36).toString(36)).join("");
}

function setDBInvitation(str, expireIn, callback) {
    async.waterfall([
        function (next) {
            db.set('invitation:exam:' + str, str, next);
        },
        function (next) {
            db.pexpireAt('invitation:exam:' + str, Date.now() + expireIn, next);
        }
    ], callback);
}

function removeDBInvitation(str, callback) {
    async.waterfall([
        function (next) {
            db.delete('invitation:exam:' + str, next);
        }
    ], callback);
}

function checkDBInvitation(str, next) {
    db.get('invitation:exam:' + str, (err, result) => {
        if(err) {
            next(null, false);
        }
        else if(result == str) {
            next(null, true);
        }
        else {
            next({
                "source" : "registration-exam",
                "message" : "invitation error"
            });
        }
    });
}

const Invitations = {
    randomInvitationString : randomInvitationString,
    setDBInvitation : setDBInvitation,
    removeDBInvitation : removeDBInvitation,
    checkDBInvitation : checkDBInvitation
};

module.exports = Invitations;