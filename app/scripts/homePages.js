angular.module('myApp.homePages', ['myApp.config', 'myApp.channels','myApp.pusher','myApp.utils', 'ngRoute'])

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/', {
      controller: 'HomeCtrl',
      templateUrl : TPL_PATH + '/home.html'
    });
  })

  .controller('HomeCtrl', function($scope, $http, API_PATH, userChannel, modifyCollection, commentChannel, pusherChannel) {


    // USERS
    $http.get(API_PATH + '/users?limit=18')
      .success(function(data) {
        $scope.users = data.users;
      });
    userChannel.bind('create', function(user) {
      $scope.$apply(function() {
        $scope.users.unshift(user);
      });
    });
    userChannel.bind('destroy', function(user) {
      $scope.$apply(function() {
        $scope.users = modifyCollection($scope.users, user, 'destroy');
      });
    });

    // COMMENTS
    $http.get(API_PATH + '/comments?limit=20')
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
  })

  .directive('featuredUser', function($http, userChannel, $templateCache, $compile, $animate, API_PATH) {
    return function($scope, element, attrs) {
      function downloadFeaturedUser() {
        $http.get(API_PATH + '/featured_users?limit=1')
          .success(function(data) {
            $scope.featured_user = data.featured_users[0];
          });
      }

      downloadFeaturedUser();
      userChannel.bind('featured-add', function(user) {
        $scope.$apply(function() {
          $scope.featured_user = user;
        });
      });
      userChannel.bind('featured-remove', function(user) {
        $scope.$apply(function() {
          downloadFeaturedUser();
        });
      });

      var tpl = $templateCache.get('featured-user');
      var userID;
      $scope.$watch('featured_user.id', function(id) {
        if(id != userID) {
          element.html('');
          var container = angular.element(tpl);
          $compile(container)($scope);
          $animate.enter(container, element);
          userID = id;
        }
      });
    };
  });
