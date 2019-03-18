'use strict';
'use very strict';

const defaultSettings = {
    "timeLimit"  : 300,
    "extraTime"  : 60,
    "qCount"     : 5,
    "eachScore"  : 20,
    "needScore"  : 60,
    "inviExpire" : 24,
    "ipDayLimit" : 0,
    "questions"  : [
    {
        "q": "The Hundred Years' War started in the year ____.",
        "a": "1337",
        "c": [],
        "n": 0,
        "m": false,
        "r": false,
        "i": false
    },
    {
        "q": "Which <b>two</b> kingdoms formed a Personal Union which eventually became the kingdom of Spain?<br />(select 2 options)",
        "a": "Aragon|Castile",
        "c": [
            "Venice",
            "Castile",
            "Aragon",
            "Brittany"
        ],
        "n": 1,
        "m": true,
        "r": false,
        "i": false
    },
    {
        "q": "Which Mongolian general invaded Persia in the 14th century and founded the Timurid Empire?",
        "a": "(Amir )?Timur|Tamerlane",
        "c": [],
        "n": 2,
        "m": false,
        "r": true,
        "i": true
    },
    {
        "q": "Which mountain did Hannibal cross in order to attack on the Roman Empire?",
        "a": "Alps",
        "c": [
            "Alps",
            "Himalaya",
            "Rocky",
            "Hyjal"
        ],
        "n": 3,
        "m": false,
        "r": false,
        "i": false
    },
    {
        "q": "The Crusaders attacked Constantinople in the ___ crusade.",
        "a": "fourth",
        "c": [
            "second",
            "third",
            "fourth",
            "fifth"
        ],
        "n": 4,
        "m": false,
        "r": false,
        "i": false
    },
    {
        "q": "Ancient American kingdoms include the Aztec, Mayan and ____ empires.",
        "a": "Inca",
        "c": [
            "Indian",
            "Inca",
            "Indonesia",
            "Inmu"
        ],
        "n": 5,
        "m": false,
        "r": false,
        "i": false
    },
    {
        "q": "The French Revolution overthrew the king ______.",
        "a": "Louis XVI",
        "c": [
            "Louis VII",
            "Louis XIV",
            "Louis XVI",
            "Louis XIX"
        ],
        "n": 6,
        "m": false,
        "r": false,
        "i": false
    },
    {
        "q": "Japanese daimyo Nobunaga Oda died in the incident of ______.",
        "a": "Honnoji",
        "c": [
            "Higurashi",
            "Honnoji",
            "Himeji",
            "Hyogokita"
        ],
        "n": 7,
        "m": false,
        "r": false,
        "i": false
    },
    {
        "q": "A ruler in the Russian empire was referred as the ____.",
        "a": "Tsar",
        "c": [
            "Tsar",
            "Caliph",
            "Dictator",
            "Celestial Emperor"
        ],
        "n": 8,
        "m": false,
        "r": false,
        "i": false
    },
    {
        "q": "Which of the following animals was cultivated in history, in South America?<br /><img src=\"https://i.imgur.com/9FYE0tu.jpg\" />",
        "a": "c",
        "c": [
            "a",
            "b",
            "c",
            "d"
        ],
        "n": 9,
        "m": false,
        "r": false,
        "i": false
    }]
};

module.exports.defaultSettings = defaultSettings;