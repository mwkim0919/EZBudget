angular.module('EZBudget').controller('transactionController',
  ['$scope', '$location', 'transactionService',
  function ($scope, $location, transactionService) {

    $scope.transactions = [];

    $scope.date = 'date';
    $scope.category = 'category';

    $scope.getTransactions = function() {
      transactionService.getTransactions()
        .then(function (response) {
          for (var i = 0; i < response.data.obj.length; i++) {
            var transaction = {
              date: response.data.obj[i].date,
              category: response.data.obj[i].category,
              description: response.data.obj[i].description,
              type: response.data.obj[i].type,
              amount: response.data.obj[i].amount
            }
            $scope.transactions.push(transaction);
          }
        })
        .catch(function () {
          // DO something
        });
    };

    $scope.addTransaction = function() {
      transactionService.addTransaction($scope.transaction.date, $scope.transaction.category, $scope.transaction.description, $scope.transaction.type, $scope.transaction.amount)
        .then(function () {
          var transaction = {
            date: $scope.transaction.date,
            category: $scope.transaction.category,
            description: $scope.transaction.description,
            type: $scope.transaction.type,
            amount: $scope.transaction.amount
          }
          $scope.transactions.push(transaction);
          $('#transaction-form').modal('toggle');
          $scope.transaction = {};
          $location.path('/finance');
        })
        .catch(function () {
          // DO something
        });
    };

}]);