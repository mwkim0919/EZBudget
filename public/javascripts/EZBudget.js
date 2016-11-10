var myApp = angular.module('EZBudget', ['ngRoute', 'chart.js', 'angularUtils.directives.dirPagination', 'mwl.calendar', 'ui.bootstrap', 'ngAnimate']);

myApp.config(function ($routeProvider) {

  $routeProvider
  .when('/', {
    templateUrl: 'templates/home.html',
    controller: 'userController',
    access: {restricted: false}
  })

  .when('/dashboard', {
    templateUrl: 'templates/dashboard.html',
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

  .when('/transactions', {
    templateUrl: 'templates/transactions.html',
    controller: 'transactionController',
    access: {restricted: true}
  })

  .when('/schedules', {
    templateUrl: 'templates/schedule.html',
    controller: 'scheduleController',
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