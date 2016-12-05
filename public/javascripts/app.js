var TIMER_VALUE = 5000;

angular.module("players",['ngRoute'])
  .controller('playersCtrl', function ($http, $scope, $timeout) {

    $timeout(getPlayers,0);

    function getPlayers () {

      $http({
        method: 'GET',
        url: 'api/players'
      }).then(function successCallback(res) {
        $scope.players = res.data;
        $timeout(getPlayers,TIMER_VALUE);
      }, function errorCallback(res) {
        $scope.error = res.status + ": " + res.data.statusText;
      });
    }

  }).controller('matchesCtrl', function ($http, $scope, $timeout,$filter) {

    $timeout(getMatches,0);

    function getMatches () {

        $http({
            method: 'GET',
            url: 'api/matches'
        }).then(function successCallback(res) {
            $scope.matches = res.data;
            $timeout(getMatches,TIMER_VALUE);
            $scope.winningMatches = $scope.matches.filter(function(match){
                if(match.score1 > match.score2){
                    console.log("test1")
                    $scope.customStyle1 = {};
                    $scope.customStyleL2 = {};
                    $scope.customStyle1.style = {"color":"green"};
                    $scope.customStyle2.style = {"color":"red"};
                    return (match)
                }else if(match.score2 > match.score1) {
                    console.log("test2")
                    $scope.customStyle1 = {};
                    $scope.customStyle2 = {};
                    $scope.customStyle2.style = {"color":"green"};
                    $scope.customStyle1.style = {"color":"red"};
                    return (match)
                }
            });
        }, function errorCallback(res) {
            $scope.error = res.status + ": " + res.data.statusText;
        });
    }


}).config(function ($routeProvider) {
    $routeProvider
        .when("/Ranking", {
            templateUrl: "views/Ranking.html",
            controller: "playersCtrl"
        })
        .when("/Matches", {
            templateUrl: "views/Matches.html",
            controller: "matchesCtrl"
        })

        .otherwise({
            redirectTo: "/Ranking"
        });
}).filter('makeBold', function() {
    console.log("test")
   //  console.log(match)
   // if(match.score1 > match.score2){
   //     match.player1.bold();
   // }
});