angular.module('EZBudget').controller('transactionController',
  ['$scope', '$location', 'transactionService',
  function ($scope, $location, transactionService) {

    $scope.transactions = [];
    $scope.balance = 0;
    $scope.categories = ['Clothing', 'Education', 'Entertainment', 'Food', 'Housing', 'Medical', 'Personal', 'Transportation', 'Utilities'];
    $scope.views = [];
    $scope.barChart = [[],[],[]];

    $scope.barlabels = [];
    $scope.barseries = ['Earning', 'Expense'];
    $scope.bardata = [[], []];

    $scope.labels2 = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data2 = [300, 500, 100];

    $scope.getTransactions = function() {
      transactionService.getTransactions()
        .then(function (response) {
          var dateSet = response.data.obj[0].date.substring(0,7);
          var view = null;
          var earning = 0;
          var expense = 0;
          for (var i = 0; i < response.data.obj.length; i++) {
            var transaction = {
              date: response.data.obj[i].date,
              category: response.data.obj[i].category,
              description: response.data.obj[i].description,
              type: response.data.obj[i].type,
              amount: (response.data.obj[i].type == 'Expense') ? -response.data.obj[i].amount : response.data.obj[i].amount
            }
            if (dateSet == transaction.date.substring(0,7)) {
              if (response.data.obj[i].type == 'Expense') {
                expense += response.data.obj[i].amount;
              } else {
                earning += response.data.obj[i].amount;
              }
            } else {
              $scope.views.push(dateSet);
              $scope.barlabels.push(dateSet);
              $scope.bardata[0].push(earning);
              $scope.bardata[1].push(expense);
              $scope.barChart[0].push(dateSet);
              $scope.barChart[1].push(earning);
              $scope.barChart[2].push(expense);
              dateSet = transaction.date.substring(0,7);
              balance = transaction.amount;
              if (response.data.obj[i].type == 'Expense') {
                expense = response.data.obj[i].amount;
                earning = 0;
              } else {
                earning = response.data.obj[i].amount;
                expense = 0;
              }
            }
            $scope.balance += transaction.amount;
            $scope.transactions.push(transaction);
          }
          $scope.views.push(dateSet);
          $scope.barlabels.push(dateSet);
          $scope.bardata[0].push(earning);
          $scope.bardata[1].push(expense);
          $scope.barChart[0].push(dateSet);
          $scope.barChart[1].push(earning);
          $scope.barChart[2].push(expense);
          earning = 0;
          expense = 0;
          $scope.barlabels.reverse();
          $scope.bardata[0].reverse();
          $scope.bardata[1].reverse();
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
            amount: ($scope.transaction.type == 'Expense') ? -$scope.transaction.amount : $scope.transaction.amount
          }
          $scope.transactions.push(transaction);
          $scope.balance += transaction.amount;
          $('#transaction-form').modal('toggle');
          $scope.transaction = {};
          $location.path('/finance');
          console.log($scope.bardata);
          console.log(typeof($scope.transaction.date));
          for (var i = 0; i < $scope.barlabels.length; i++) {
            if ($scope.barlabels[i] == $scope.transaction.date.substring(0,7)) {
              if ($scope.transaction.type == 'Earning') {
                $scope.bardata[0][i] += $scope.transaction.amount;
              } else {
                $scope.bardata[1][i] += $scope.transaction.amount;
              }
            }
          }
          console.log($scope.bardata);
        })
        .catch(function () {
          // DO something
        });
    };

}]);