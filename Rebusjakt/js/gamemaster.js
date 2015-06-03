
var GameMaster = function (hunt) {
    this.gameRiddles = [];
    this.huntId = hunt.HuntId;
    this.huntKey = "hunt" + hunt.HuntId + "user" + hunt.UserId;
    this.userId = hunt.UserId;
    this.started = Date.now();
    this.duration = hunt.TimeLimit * 60;
    this.endGameRiddle = {
        riddle: {
            LocationName: hunt.EndLocation,
            Latitude: hunt.EndLatitude,
            Longitude: hunt.EndLongitude
        },
        isUnlocked: false,
        isSuspicious: false,
        hasQuestions: false
    };
    //first try to load
    this.load();
    if (this.gameRiddles.length === 0) {
        this.create(hunt.Riddles);
        this.save();
    }
}

GameMaster.prototype.create = function (riddles) {
    var gameRiddles = [];
    riddles.forEach(function (riddle) {
        var gameQuestions = [];
        riddle.Questions.forEach(function (q) {
            gameQuestions.push({
                question: q,
                isAnswered: false,
                isCorrect: false
            });
        });
        gameRiddles.push({
            riddle: riddle,
            gameQuestions: gameQuestions,
            isSolved: false,
            hasQuestions: false,
            isCorrect: false,
            isSuspicious: false,
            isCompleted: false
        });
    });
    this.gameRiddles = gameRiddles;
}

GameMaster.prototype.load = function () {
    var gameObj = JSON.parse(localStorage.getItem(this.huntKey));
    if (gameObj) {
        this.gameRiddles = gameObj.gameRiddles || [];
        this.started = gameObj.started || Date.now();
    } else {
        this.gameRiddles = [];
        this.started = Date.now();
    }    
}

GameMaster.prototype.save = function () {
    var gameObj = { started: this.started, gameRiddles: this.gameRiddles };
    localStorage.setItem(this.huntKey, JSON.stringify(gameObj));
}

GameMaster.prototype.finish = function (callBack) {
    var timeInSeconds = (((Date.now() - this.started) / 1000) | 0);
    var userScore = {
        UserId: this.userId,
        HuntId: this.huntId,
        Score: this.score(),
        TimeInSeconds: timeInSeconds
    };
    this.endTime = timeInSeconds;
    $.post("/game/savescore", userScore, callBack, "json");
    localStorage.removeItem(this.huntKey);
}

GameMaster.prototype.score = function () {
    var score = 0;
    this.gameRiddles.forEach(function (r) {
        if (r.isCorrect) {
            score += r.isSuspicious ? 2 : 3;
            score += r.gameQuestions.filter(function (q) { return q.isCorrect; }).length;
        }
    });
    if (!this.endGameRiddle.isSuspicious) {
        score += 3;
    }
    return score;
}
