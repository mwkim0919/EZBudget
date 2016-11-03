angular.module('EZBudget').controller('transactionController',
  ['$scope', '$location', 'transactionService',
  function ($scope, $location, transactionService) {

    $scope.transactions = [];
    $scope.balance = 0;
    $scope.views = [];
    $scope.categories = ['Clothing', 'Education', 'Entertainment', 'Food', 'Housing', 'Medical', 'Personal', 'Transportation', 'Utilities'];
    
    $scope.filterTransaction = function(transaction) {
      return transaction.description === $scope.Filter.query || 
        transaction.amount === $scope.Filter.query ||
        transaction.date === $scope.Filter.date ||
        transaction.category === $scope.Filter.category;
    }

    $scope.getTransactions = function() {
      transactionService.getTransactions()
        .then(function (response) {
          var dateSet = response.data.obj[0].date.substring(0,7);
          var balance = 0;
          var view = null;
          for (var i = 0; i < response.data.obj.length; i++) {
            var transaction = {
              date: response.data.obj[i].date,
              category: response.data.obj[i].category,
              description: response.data.obj[i].description,
              type: response.data.obj[i].type,
              amount: (response.data.obj[i].type == 'Expense') ? -response.data.obj[i].amount : response.data.obj[i].amount
            }
            if (dateSet == transaction.date.substring(0,7)) {
              balance += transaction.amount;
            } else {
              view = new Object();
              view.date = dateSet;
              view.balance = balance;
              $scope.views.push(view);
              dateSet = transaction.date.substring(0,7);
              balance = transaction.amount;
            }
            $scope.balance += transaction.amount;
            $scope.transactions.push(transaction);
          }
          view = new Object();
          view.date = dateSet;
          view.balance = balance;
          $scope.views.push(view);
        })
        .catch(function () {
          // DO something
        });
        console.log($scope.views);
    };

    $scope.addTransaction = function() {
      transactionService.addTransaction($scope.transaction.date, $scope.transaction.category, $scope.transaction.description, $scope.transaction.type, $scope.transaction.amount)
        .then(function () {
          var transaction = {
            date: $scope.transaction.date,
            category: $scope.transaction.category,
            description: $scope.transaction.description,
            type: $scope.transaction.type,
            amount: ($scope.transaction.type == 'Expense') ? -$scope.transaction.amount : $scope.transaction.amount
          }
          $scope.transactions.push(transaction);
          $scope.balance += transaction.amount;
          $('#transaction-form').modal('toggle');
          $scope.transaction = {};
          $location.path('/finance');
        })
        .catch(function () {
          // DO something
        });
    };

}]);