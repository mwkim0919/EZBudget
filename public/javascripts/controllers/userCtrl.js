angular.module('EZBudget').controller('userController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.isLoggedIn = AuthService.getUserStatus;
    
    $scope.login = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call login from service
      AuthService.login($scope.signinForm.email, $scope.signinForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.signinForm = {};
          $scope.current_user = $scope.signinForm.email;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.signinForm = {};
        });
    };

    $scope.logout = function () {
      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/');
        });
    };

    $scope.register = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });
    };

}]);