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
ObjectId=require('mongodb').ObjectId;
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
    db.collection("matches").find({},{__v: 0}).toArray(function (err, matches) {
        if (err) {
            res.status(500);
            return res.json({code: 500, msg: "Could not fetch matches"})
        }
        res.json(matches);
    })
})

router.post("/matches", function (req, res) {
    var match = req.body;
    var db = connection.get();
    db.collection("matches").insertOne(match, function (err, r) {
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not create a new match"})
        }
        var newMatch = r.result;
        console.log(newMatch);
        return res.json(match);
    })

})


router.put("/matches", function (req, res) {
    var match = req.body;
    var db = connection.get();
    var id = new ObjectId(match._id);
    delete match._id;
    db.collection("matches").replaceOne({_id:id},match,function(err,result){
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not update the provided match: "+err})
        }
        console.log("Result: "+result);
        return res.json(result);
    });

});

router.delete("/matches", function (req, res) {
    var match = req.body;
    var db = connection.get();
    var id = new ObjectId(match._id);
    db.collection("matches").deleteOne({_id:id},match,function(err,deleted){
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not delete the provided match: "+err})
        }
        console.log("Deleted: "+deleted);
        return res.json(deleted);
    });

});


module.exports = router;