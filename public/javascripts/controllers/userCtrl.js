angular.module('EZBudget').controller('userController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    $scope.current_user = AuthService.getCurrentUserName();

    $scope.login = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call login from service
      AuthService.login($scope.signinForm.email, $scope.signinForm.password)
        // handle success
        .then(function () {
          $location.path('/dashboard');
          $scope.disabled = false;
          $scope.signinForm = {};
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
      $scope.register_error = false;
      $scope.disabled = true;
      $scope.message = false;
      // call register from service
      if ($scope.registerForm.password != $scope.registerForm.password_confirm) {
        $scope.register_error = true;
        $scope.message = false;
        $scope.disabled = false;
        $scope.errorMessage = "Password does not match the confirm password."
        return;
      } else {
        AuthService.register($scope.registerForm.username, $scope.registerForm.password)
          // handle success
          .then(function () {
            // $location.path('/');
            $scope.disabled = false;
            $scope.message = true;
            $scope.error = false;
            $scope.registerMessage = "Registration Success! Please sign in!"
            $scope.registerForm = {};
            $("#login-form").delay(100).fadeIn(100);
            $("#register-form").fadeOut(100);
            $('#register-form-link').removeClass('active');
            $('#login-form-link').addClass('active');
          })
          // handle error
          .catch(function () {
            $scope.register_error = true;
            $scope.message = false;
            $scope.errorMessage = "Something went wrong! Please try again.";
            $scope.disabled = false;
            $scope.registerForm = {};
          });
      };
    }

}]);