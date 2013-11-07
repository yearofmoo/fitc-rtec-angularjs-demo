angular.module('myApp.utils', [])

  .factory('modifyCollection', function() {
    return function(collection, newItem, action) {
      var newCollection = [];
      angular.forEach(collection, function(item) {
        if(item.id == newItem.id) {
          if(action == 'destroy') return;
          if(action == 'update') {
            item = newItem;
          }
        }
        newCollection.push(item);
      });
      return newCollection;
    };
  });
