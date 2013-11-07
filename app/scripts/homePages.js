angular.module('myApp.homePages', ['myApp.config', 'ngRoute'])

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/', {
      controller: 'HomeCtrl',
      templateUrl : TPL_PATH + '/home.html'
    });
  })

  .controller('HomeCtrl', function($scope, $http, API_PATH) {
    $http.get(API_PATH + '/users')
      .success(function(data) {
        $scope.users = data.users;
      });

    $http.get(API_PATH + '/comments')
      .success(function(data) {
        $scope.comments = data.comments;
      });
  });
