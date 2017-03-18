/**
 * Created by Magnus on 01-10-2016.
 */
var express = require("express");
var router = express.Router();
var cors = require("cors");
var connection = require("../config/database");
ObjectId=require('mongodb').ObjectId;
//router.all("/projects",cors(),function(req,res,next){
//  next();
//})

router.all("/players", cors(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE'
    res.header['Access-Control-Allow-Headers'] = ' Content-Type, Accept';
    next();
})

router.get("/players", function (req, res) {
    var db = connection.get();
    db.collection("players").find({},{__v: 0}).toArray(function (err, players) {
        if (err) {
            res.status(500);
            return res.json({code: 500, msg: "Could not fetch players"})
        }
        res.json(players);
    })
})

router.post("/players", function (req, res) {
    var player = req.body;
    var db = connection.get();
    db.collection("players").insertOne(player, function (err, r) {
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not create a new player"})
        }
        var newPlayer = r.result;
        console.log(newPlayer);
        return res.json(player);
    })

})


router.put("/players", function (req, res) {
    var player = req.body;
    var db = connection.get();
    var id = new ObjectId(player._id);
    delete player._id;
    db.collection("players").replaceOne({_id:id},player,function(err,result){
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not update the provided player: "+err})
        }
        console.log("Result: "+result);
        return res.json(player);
    });

});


router.delete("/players", function (req, res) {
    var player = req.body;
    var db = connection.get();
    var id = new ObjectId(player._id);
    db.collection("players").deleteOne({_id:id},player,function(err,deleted){
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not delete the provided player: "+err})
        }
        console.log("Deleted: "+deleted);
        return res.json(deleted);
    });

});


module.exports = router;