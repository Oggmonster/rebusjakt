
var GameMaster = function (riddles, huntid) {
    this.gameRiddles = [];
    this.huntId = huntid;   
    this.huntKey = "hunt" + huntid;
    //first try to load
    this.load();
    if (this.gameRiddles.length === 0) {
        this.create(riddles);
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
            isCompleted: false
        });
    });
    this.gameRiddles = gameRiddles;
}

GameMaster.prototype.load = function () {
    var gameRiddles = JSON.parse(localStorage.getItem(this.huntKey));
    this.gameRiddles = gameRiddles || [];
}

GameMaster.prototype.save = function () {
    console.log(this.gameRiddles);
    localStorage.setItem(this.huntKey, JSON.stringify(this.gameRiddles));
}

GameMaster.prototype.score = function () {
    var score = 0;
    this.gameRiddles.forEach(function (r) {
        if (r.isCorrect) {
            score += 3;
            score += r.gameQuestions.filter(function (q) { return q.isCorrect; }).length;
        }
    });
    return score;
}
