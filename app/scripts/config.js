angular.module('myApp.config', [])
  .constant('TESTING_PORT', "9999")
  .constant('API_PATH', '/api/v1')
  .constant('TPL_PATH', '/templates')
  .factory('myAppInTest', function(TESTING_PORT) {
    return window.location.port == TESTING_PORT;
  })
