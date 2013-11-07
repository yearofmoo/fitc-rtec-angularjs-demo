angular.module('myApp.pusher', ['myApp.config'])

  .value('PUSHER_ID', '8775f81254810188bcfd')

  .factory('pusherInstance', function(PUSHER_ID) {
    return new Pusher(PUSHER_ID);
  })

  .factory('pusherChannel', function(pusherInstance, myAppInTest) {
    if(myAppInTest === true) {
      return function(channel) {
        return {
          bind : angular.noop
        }
      }
    }
    else {
      return function(channel) {
        return pusherInstance.subscribe(channel);
      }
    }
  });
