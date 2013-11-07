angular.module('myApp.commentPages', ['myApp.config', 'ngRoute'])

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/comments', {
      controller: 'CommentsCtrl',
      templateUrl : TPL_PATH + '/comments.html'
    });
  })

  .controller('CommentsCtrl', function($scope, $http, API_PATH) {
    $http.get(API_PATH + '/comments')
      .success(function(data) {
        $scope.comments = data.comments;
      });
  });
