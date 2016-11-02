angular.module('EZBudget').controller('transactionController',
  ['$scope', '$location', 'transactionService',
  function ($scope, $location, transactionService) {

    $scope.transactions = transactionService.getTransactions();

    $scope.addTransaction = function() {
      transactionService.addTransaction($scope.transaction.date, $scope.transaction.category, $scope.transaction.description, $scope.transaction.type, $scope.transaction.amount)
        .then(function () {
          $('#transaction-form').modal('toggle');
          $scope.transaction = {};
          $location.path('/finance');
        })
        .catch(function () {
          // DO something
        });
    };

}]);