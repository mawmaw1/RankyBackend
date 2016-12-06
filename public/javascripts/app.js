var TIMER_VALUE = 5000;

var HOST = "http://localhost:3010";


angular.module("players", ['ngRoute'])
    .controller('playersCtrl', function ($http, $scope, $timeout) {

        $timeout(getPlayers, 0);

        function getPlayers() {

            $http({
                method: 'GET',
                url: 'api/players'
            }).then(function successCallback(res) {
                $scope.players = res.data;
                $timeout(getPlayers, TIMER_VALUE);
            }, function errorCallback(res) {
                $scope.error = res.status + ": " + res.data.statusText;
            });
        }




    }).controller('matchesCtrl', function ($http, $scope, $timeout, $filter) {

    $timeout(getMatches, 0);

    function getMatches() {

        $http({
            method: 'GET',
            url: 'api/matches'
        }).then(function successCallback(res) {
            $scope.matches = res.data;
            $timeout(getMatches, TIMER_VALUE);
            $scope.winningMatches = $scope.matches.filter(function (match) {
                if (match.score1 > match.score2) {
                    console.log("test1")
                    $scope.customStyle1 = {};
                    $scope.customStyleL2 = {};
                    $scope.customStyle1.style = {"color": "green"};
                    $scope.customStyle2.style = {"color": "red"};
                    return (match)
                } else if (match.score2 > match.score1) {
                    console.log("test2")
                    $scope.customStyle1 = {};
                    $scope.customStyle2 = {};
                    $scope.customStyle2.style = {"color": "green"};
                    $scope.customStyle1.style = {"color": "red"};
                    return (match)
                }
            });
        }, function errorCallback(res) {
            $scope.error = res.status + ": " + res.data.statusText;
        });
    }


}).factory('Matches', function ($http) {

    return {

        saveMatch: function (matches) {
            $http.post(HOST + "/api/matches", matches).then(
                function ok(res) {

                },
                function error(res) {
                    console.log("Todo: handle error");
                });
        },

        newMatch: function (player1, player2, score1, player3, player4, score2) {
            // Add a new match
            return {
                player1: player1,
                player2: player2,
                score1: score1,
                player3: player3,
                player4: player4,
                score2: score2
            };
        },


    }
}).controller('NewMatches', function ($http, $scope, $timeout, Matches) {

    $timeout(getPlayers, 0);

    function getPlayers() {

        $http({
            method: 'GET',
            url: 'api/players'
        }).then(function successCallback(res) {
            $scope.players = res.data;
            $timeout(getPlayers, 2000000);
        }, function errorCallback(res) {
            $scope.error = res.status + ": " + res.data.statusText;
        });
    }

    $scope.newMatch = function (match) {


        if (match.player1,match.player2,match.score1,match.player3,match.player4,match.score2) {

            createMatch(match.player1,match.player2,match.score1,match.player3,match.player4,match.score2);

        }else if((match.player1,match.player2,match.player3,match.player4) && (match.score1 == 0 | match.score2 ==0)){
            createMatch(match.player1,match.player2,match.score1,match.player3,match.player4,match.score2);
        }

    };
    var createMatch = function (player1,player2,score1,player3,player4,score2) {

        var newMatch = Matches.newMatch(player1, player2, score1, player3, player4, score2);

        Matches.saveMatch(newMatch, $scope);
        updatePlayers(newMatch);

    }
var updatePlayers = function(match)
    {

        var kFactor = 32;

        if(match.score1 > match.score2){
            combinedRatingWin = (match.player1.score + match.player2.score)/2;
            combinedRatingLose = (match.player3.score + match.player4.score)/2;
            var qw = Math.pow(10,(combinedRatingWin/400));
            var ql = Math.pow(10,(combinedRatingLose/400));
            var lossExpectation = ql/(ql+qw);
            var endresult = parseInt(kFactor*lossExpectation)
            match.player1.score += endresult;
            match.player2.score += endresult;
            match.player3.score -= endresult;
            match.player4.score -= endresult;
            $http.put(HOST + "/api/players", match.player1);
            $http.put(HOST + "/api/players", match.player2);
            $http.put(HOST + "/api/players", match.player3);
            $http.put(HOST + "/api/players", match.player4);
        }else{
            combinedRatingWin = (match.player3.score + match.player4.score)/2;
            combinedRatingLose = (match.player1.score + match.player2.score)/2;
            var qw = Math.pow(10,(combinedRatingWin/400));
            var ql = Math.pow(10,(combinedRatingLose/400));
            var lossExpectation = ql/(ql+qw);
            var endresult = parseInt(kFactor*lossExpectation)
            match.player3.score += endresult;
            match.player4.score += endresult;
            match.player1.score -= endresult;
            match.player2.score -= endresult;
            $http.put(HOST + "/api/players", match.player1);
            $http.put(HOST + "/api/players", match.player2);
            $http.put(HOST + "/api/players", match.player3);
            $http.put(HOST + "/api/players", match.player4);
        }
    }

})



    .config(function ($routeProvider) {
        $routeProvider
            .when("/Ranking", {
                templateUrl: "views/Ranking.html",
                controller: "playersCtrl"
            })
            .when("/Matches", {
                templateUrl: "views/Matches.html",
                controller: "matchesCtrl"
            })
            .when("/NewMatch", {
                templateUrl: "views/NewMatch.html"
            })
            .otherwise({
                redirectTo: "/Ranking"
            });
    }).filter('makeBold', function () {
    console.log("test")
    //  console.log(match)
    // if(match.score1 > match.score2){
    //     match.player1.bold();
    // }
}).filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<max; i++)
            input.push(i);
        return input;
    };
});