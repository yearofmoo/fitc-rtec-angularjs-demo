angular.module('myApp.profilePages', ['myApp.config', 'ngRoute'])

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/users', {
      controller: 'UsersCtrl',
      templateUrl : TPL_PATH + '/users.html'
    });
    $routeProvider.when('/users/:user_id', {
      controller: 'ProfileCtrl',
      templateUrl : TPL_PATH + '/profile.html',
      resolve : {
        user : function($location, $q, $http, API_PATH) {
          var userID = $location.path().match(/users\/(\d+)/)[1];
          var defer = $q.defer();
          $http.get(API_PATH + '/users/' + userID)
            .success(function(data) {
              defer.resolve(data);
            })
            .error(function(data) {
              defer.reject();
            });
          return defer.promise;
        }
      }
    });
  })

  .controller('UsersCtrl', function($scope, $http, API_PATH) {
    $http.get(API_PATH + '/users')
      .success(function(data) {
        $scope.users = data.users;
      });
  })

  .controller('ProfileCtrl', function($scope, $http, API_PATH, user, pusherChannel) {
    $scope.user = user;
    var userID = user.id;

    $http.get(API_PATH + '/users/' + userID + '/comments')
      .success(function(data) {
        $scope.comments = data.comments;
      });

    var userComments = pusherChannel('user-' + userID + '-comments');
    userComments.bind('create', function(comment) {
      $scope.$apply(function() {
        $scope.comments.push(comment);
      });
    });
    userComments.bind('destroy', function(comment) {
      $scope.$apply(function() {
        $scope.comments = modifyCollection($scope.comments, comment, 'destroy');
      });
    });
  });
