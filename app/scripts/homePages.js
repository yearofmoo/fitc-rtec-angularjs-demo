angular.module('myApp.homePages', ['myApp.config', 'myApp.channels', 'ngRoute'])

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/', {
      controller: 'HomeCtrl',
      templateUrl : TPL_PATH + '/home.html'
    });
  })

  .controller('HomeCtrl', function($scope, $http, API_PATH, userChannel) {
    userChannel.bind('create', function() {
      alert('user created');
    });
    userChannel.bind('destroy', function() {
      alert('user destroyed');
    });

    $http.get(API_PATH + '/featured_users?limit=1')
      .success(function(data) {
        $scope.featured_user = data.featured_users[0];
      });

    $http.get(API_PATH + '/users?limit=6')
      .success(function(data) {
        $scope.users = data.users;
      });

    $http.get(API_PATH + '/comments?limit=5')
      .success(function(data) {
        $scope.comments = data.comments;
      });
  });
