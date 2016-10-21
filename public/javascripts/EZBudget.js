var app = angular.module('EZBudget', ['ngRoute']);

app.config(['$locationProvider', '$routeProvider', function config($locationProvider, $routeProvider) {
  // $locationProvider.hashPrefix('!');

  $routeProvider
    
    .when('/', {
      template: 'Hello World'
    })

    .when('/signin', {
      templateUrl: 'templates/signin.html'
    })

    .when('/signup', {
      templateUrl: 'templates/signup.html'
    })
    
    .otherwise('/');

}]);