var myApp = angular.module('EZBudget', ['ngRoute', 'chart.js']);

myApp.config(function ($routeProvider) {

  $routeProvider
  .when('/', {
    templateUrl: 'templates/home.html',
    controller: 'userController',
    access: {restricted: false}
  })

  .when('/dashboard', {
    templateUrl: 'templates/dashboard.html',
    controller: 'userController',
    access: {restricted: true}
  })

  .when('/signout', {
    controller: 'userController',
    access: {restricted: true}
  })
  
  .when('/settings', {
    templateUrl: 'templates/settings.html',
    controller: 'userController',
    access: {restricted: true}
  })

  .when('/finance', {
    templateUrl: 'templates/finance.html',
    controller: 'transactionController',
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
          $location.path('/');
          $route.reload();
        } else if (!next.access.restricted && AuthService.isLoggedIn()) {
          $location.path('/dashboard');
          $route.reload();
        }
      });
    });
});