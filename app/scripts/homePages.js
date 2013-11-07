angular.module('myApp.homePages', ['myApp.config', 'myApp.channels','myApp.pusher','myApp.utils', 'ngRoute'])

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/', {
      controller: 'HomeCtrl',
      templateUrl : TPL_PATH + '/home.html'
    });
  })

  .controller('HomeCtrl', function($scope, $http, API_PATH, userChannel, modifyCollection, commentChannel, pusherChannel) {


    // USERS
    $http.get(API_PATH + '/users?limit=6')
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
  })

  .directive('featuredUser', function($http, userChannel, $templateCache, $compile, API_PATH) {
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
      $scope.$watch('featured_user.id', function() {
        var container = angular.element(tpl);
        element.html('');
        element.append(container);
        $compile(container)($scope);
      });
    };
  });
