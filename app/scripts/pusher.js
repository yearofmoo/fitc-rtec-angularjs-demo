angular.module('myApp.pusher', [])

  .value('PUSHER_ID', '8775f81254810188bcfd')

  .factory('pusherInstance', function(PUSHER_ID) {
    return new Pusher(PUSHER_ID);
  })

  .factory('pusherChannel', function(pusherInstance) {
    return function(channel) {
      return pusherInstance.subscribe(channel);
    }
  });
