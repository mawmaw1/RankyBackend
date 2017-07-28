/**
 * Created by Magnus on 01-10-2016.
 */
/**
 * Created by Magnus on 01-10-2016.
 */
var express = require("express");
var router = express.Router();
var cors = require("cors");
var connection = require("../config/database");
ObjectId = require('mongodb').ObjectId;
//router.all("/projects",cors(),function(req,res,next){
//  next();
//})

router.all("/matches", cors(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE'
    res.header['Access-Control-Allow-Headers'] = ' Content-Type, Accept';
    next();
})

router.get("/matches", function (req, res) {
    var db = connection.get();
    db.collection("matches").find({}, {__v: 0}).toArray(function (err, matches) {
        if (err) {
            res.status(500);
            return res.json({code: 500, msg: "Could not fetch matches"})
        }
        res.json(matches);
    })
})


router.get("/matches/multiple", function (req, res) {
    var db = connection.get();
    var match = req.body;


})


router.post("/matches", function (req, res) {
    var match = req.body;
    var db = connection.get();

    db.collection("matches").insertOne(match, function (err, r) {
        if (err) {
            res.status(500);
            return res.json({code: 500, msg: "Could not create a new match", err: err})
        }
        var newMatch = r.result;
        console.log(newMatch);
        return res.json(match);
    })
    //updatePlayers(match)
})


router.put("/matches", function (req, res) {
    var match = req.body;
    var db = connection.get();
    var id = new ObjectId(match._id);
    delete match._id;
    db.collection("matches").replaceOne({_id: id}, match, function (err, result) {
        if (err) {
            res.status(500);
            return res.json({code: 500, msg: "Could not update the provided match: " + err})
        }
        console.log("Result: " + result);
        return res.json(result);
    });

});

router.delete("/matches", function (req, res) {
    var match = req.body;
    var db = connection.get();
    var id = new ObjectId(match._id);
    db.collection("matches").deleteOne({_id: id}, match, function (err, deleted) {
        if (err) {
            res.status(500);
            return res.json({code: 500, msg: "Could not delete the provided match: " + err})
        }
        console.log("Deleted: " + deleted);
        return res.json(deleted);
    });

});


var updatePlayers = function (match) {
    var kFactor = 32;

    if (match.score1 > match.score2) {
        combinedRatingWin = (match.player1.score + match.player2.score) / 2;
        combinedRatingLose = (match.player3.score + match.player4.score) / 2;
        var qw = Math.pow(10, (combinedRatingWin / 400));
        var ql = Math.pow(10, (combinedRatingLose / 400));
        var lossExpectation = ql / (ql + qw);
        var endresult = parseInt(kFactor * lossExpectation)
        match.player1.score += endresult;
        match.player2.score += endresult;
        match.player3.score -= endresult;
        match.player4.score -= endresult;
        putUpdatedPlayersWin(match.player1)
        putUpdatedPlayersWin(match.player2)
        putUpdatedPlayersLoss(match.player3)
        putUpdatedPlayersLoss(match.player4)


    } else {
        combinedRatingWin = (match.player3.score + match.player4.score) / 2;
        combinedRatingLose = (match.player1.score + match.player2.score) / 2;
        var qw = Math.pow(10, (combinedRatingWin / 400));
        var ql = Math.pow(10, (combinedRatingLose / 400));
        var lossExpectation = ql / (ql + qw);
        var endresult = parseInt(kFactor * lossExpectation)
        match.player3.score += endresult;
        match.player4.score += endresult;
        match.player1.score -= endresult;
        match.player2.score -= endresult;
        putUpdatedPlayersLoss(match.player1)
        putUpdatedPlayersLoss(match.player2)
        putUpdatedPlayersWin(match.player3)
        putUpdatedPlayersWin(match.player4)

    }
}

var winningTeamPutter = function(match){

}




var putUpdatedPlayersWin = function (player) {
    var id = new ObjectId(player._id);
    var db = connection.get();
    delete player._id;
    player.totalWins++;
    player.currentWinningStreak++;

    if(player.currentWinningStreak > player.totalWinningStreak){
        player.totalWinningStreak = player.currentWinningStreak;
    }

    db.collection("players").replaceOne({_id: id}, player, function (err, result) {
        if (err) {
            console.log("error")
        }
        console.log("Result: " + result);
    });
}

var putUpdatedPlayersLoss = function (player) {
    var id = new ObjectId(player._id);
    var db = connection.get();
    delete player._id;
    db.collection("players").replaceOne({_id: id}, player, function (err, result) {
        if (err) {
            console.log("error")
        }
        console.log("Result: " + result);
   });
}

module.exports = router;