describe('myApp', function() {

  var ptor = protractor.getInstance();

  it('should load the homepage', function() {
    ptor.get('/#');
    expect($('#view-container').getText()).toContain('Featured User');
  });

  it('should load the users', function() {
    ptor.get('/#/users');
    expect($('#view-container').getText()).toContain('users found');
  });

  it('should load the comments', function() {
    ptor.get('/#/comments');
    expect($('#view-container').getText()).toContain('comments found');
  });

});
