angular.module('EZBudget')
  .config(['$locationProvider', '$routeProvider', function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
      .when('/signin', {
        template: '<signin></signin>'
      })

      .otherwise('/');
    }
  ]);