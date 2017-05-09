(function () {
    var TelegramBot = require('node-telegram-bot-api');
    var token = '337492716:AAFuSjXGkPdJOOrevu1sV8gaI_0pOgc2vn0';
    var bot = new TelegramBot(token, {
        polling: true
    });
    var Horseman = require('node-horseman');
    var horseman = new Horseman();

    var arrays = [];
    Array.prototype.clean = function (deleteValue) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };
    activate()

    function activate() {
        getParceData();
        setInterval(function () {
            getParceData();
        }, 86400)
    }

    function getParceData() {
        arrays = [];
        horseman
            .open('https://tb.by/business/')
            .evaluate(function () {
                return document.querySelectorAll('.table-course')[1].innerText;
            })
            .then(function (tableText) {
                var stringArray = tableText.split(/\r\n|\r|\n/).clean('').splice(1, 2);
                for (var i = 0; i < stringArray.length; i++) {
                    arrays.push(stringArray[i].split('\t').splice(2, 2))
                }
            })
    }

    function compareUsd(firstNum) {
        if (+(+firstNum).toFixed(3) < +(+arrays[0][0]).toFixed(3)) {
            return 'ПОКУПАЙ! Курс:' + arrays[0][0];
        } else {
            return 'Все спокойно';
        }
    }

    function compareEur(firstNum) {
        if (+(+firstNum).toFixed(3) < +(+arrays[0][0]).toFixed(3)) {
            return 'ПОКУПАЙ! Курс:' + arrays[0][0];
        } else {
            return 'Все спокойно';
        }
    }

    bot.onText(/\/usd (.+)/, function (msg, match) {
        clearInterval(poolingUsd);
        var fromId = msg.from.id;
        var usdSum = match[1];
        bot.sendMessage(fromId, compareUsd(usdSum));
        var poolingUsd = setInterval(function () {
           bot.sendMessage(fromId, compareUsd(usdSum));
        }, 86400);
        
    });
    bot.onText(/\/eur (.+)/, function (msg, match) {
        clearInterval(poolingEur);
        var fromId = msg.from.id;
        var eurSum = match[1];
        bot.sendMessage(fromId, compareEur(eurSum));
        var poolingEur = setInterval(function () {
            bot.sendMessage(fromId, compareEur(eurSum));
        }, 86400);
    });
})()