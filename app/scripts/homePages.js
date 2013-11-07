angular.module('myApp.homePages', ['myApp.config', 'myApp.channels','myApp.utils', 'ngRoute'])

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/', {
      controller: 'HomeCtrl',
      templateUrl : TPL_PATH + '/home.html'
    });
  })

  .controller('HomeCtrl', function($scope, $http, API_PATH, userChannel, modifyCollection, commentChannel) {
    $http.get(API_PATH + '/featured_users?limit=1')
      .success(function(data) {
        $scope.featured_user = data.featured_users[0];
      });


    // USERS
    $http.get(API_PATH + '/users?limit=6')
      .success(function(data) {
        $scope.users = data.users;
      });
    userChannel.bind('create', function(user) {
      $scope.$apply(function() {
        $scope.users.push(user);
      });
    });
    userChannel.bind('destroy', function(user) {
      $scope.$apply(function() {
        $scope.users = modifyCollection($scope.users, user, 'destroy');
      });
    });


    // COMMENTS
    $http.get(API_PATH + '/comments?limit=5')
      .success(function(data) {
        $scope.comments = data.comments;
      });
    commentChannel.bind('create', function(comment) {
      $scope.$apply(function() {
        $scope.comments.push(comment);
      });
    });
    commentChannel.bind('destroy', function(comment) {
      $scope.$apply(function() {
        $scope.comments = modifyCollection($scope.comments, comment, 'destroy');
      });
    });
    commentChannel.bind('update', function(comment) {
      $scope.$apply(function() {
        $scope.comments = modifyCollection($scope.comments, comment, 'update');
      });
    });
  });
