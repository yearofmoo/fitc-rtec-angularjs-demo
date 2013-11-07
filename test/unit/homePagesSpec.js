describe('Home Pages', function() {

  beforeEach(module('myApp'));

  describe('HomeCtrl', function() {

    it('should do test the controller properly', inject(function($controller, $rootScope, $httpBackend) {
      $httpBackend.expect('GET', '/api/v1/users?limit=6')
        .respond(200, '{ "users" : [{ "first_name":"name", "last_name":"last" }] }');
      $httpBackend.expect('GET', '/api/v1/comments?limit=5')
        .respond(200, '{ "comments" : [{ "message":"message" }] }');

      var scope = $rootScope.$new();
      var ctrl = $controller('HomeCtrl', {
        $scope : scope
      });

      $httpBackend.flush();
    }));

    it('should work proprly with pusher', function() {
      var sendPusherData, pusherIndex = {}; 
      module(function($provide) {
        $provide.value('pusherChannel', function(channel) {
          pusherIndex[channel] = {};
          sendPusherData = function(channel, event, data) {
            pusherIndex[channel][event](data);
          };
          return {
            bind : function(event, fn) {
              pusherIndex[channel][event]=fn;
            }
          }
        });
      });
      inject(function($controller, $rootScope, $httpBackend) {
        $httpBackend.expect('GET', '/api/v1/users?limit=6').respond(200, '{ "users" : [] }');
        $httpBackend.expect('GET', '/api/v1/comments?limit=5').respond(200, '{ "comments" : [] }');

        var scope = $rootScope.$new();
        var ctrl = $controller('HomeCtrl', {
          $scope : scope
        });

        $httpBackend.flush();

        scope.comments = [];
        scope.users = [];

        sendPusherData('comment','create', '{ "id" : 555, "message" : "123" }');
        expect(scope.comments.length).toBe(1);

        sendPusherData('comment','destroy', '{ "id" : 555 }');
        expect(scope.comments.length).toBe(0);

        sendPusherData('user','create', '{ "id" : 123, "first_name": "matias" }');
        expect(scope.users.length).toBe(1);

        sendPusherData('user','destroy', '{ "id" : 123 }');
        expect(scope.users.length).toBe(0);
      });
    });
  });

  describe('featuredUser', function() {
    iit('should test the directive properly', function() {
      var sendPusherData, pusherIndex = {}; 
      module(function($provide) {
        $provide.value('pusherChannel', function(channel) {
          pusherIndex[channel] = {};
          sendPusherData = function(channel, event, data) {
            pusherIndex[channel][event](data);
          };
          return {
            bind : function(event, fn) {
              pusherIndex[channel][event]=fn;
            }
          }
        });
      });
      inject(function($controller, $rootScope, $httpBackend, $compile, $templateCache) {
        $templateCache.put('featured-user', '<div>{{ featured_user.first_name }}</div>');

        $httpBackend.expect('GET', '/api/v1/featured_users?limit=1')
          .respond(200, '{ "featured_users" : [{ "id" : 123, "first_name":"matias" }] }');

        var scope = $rootScope.$new();
        var element = angular.element('<div featured-user></div>');
        $compile(element)(scope);

        $httpBackend.flush();

        expect(element.text()).toContain('matias');

        sendPusherData('user','featured-add', { "id" : 444, "first_name" : "yearofmoo" });
        expect(element.text()).toContain('yearofmoo');

        $httpBackend.expect('GET', '/api/v1/featured_users?limit=1')
          .respond(200, '{ "featured_users" : [{ "id" : 123, "first_name":"matias" }] }');
      });
    });
  });

});
