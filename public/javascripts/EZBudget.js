var myApp = angular.module('EZBudget', ['ngRoute']);

myApp.config(function ($routeProvider) {

  $routeProvider
  .when('/', {
    template: 'Hello World'
  })

  .when('/signin', {
    templateUrl: 'templates/signin.html',
    controller: 'userController',
    access: {restricted: false}
  })

  .when('/signup', {
    templateUrl: 'templates/signup.html',
    controller: 'userController',
    access: {restricted: false}
  })

  .when('/signout', {
    controller: 'userController',
    access: {restricted: true}
  })
  
  .otherwise({
    redirectTo: '/'
  });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
    });
});