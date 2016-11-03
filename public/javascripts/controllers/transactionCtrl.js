angular.module('EZBudget').controller('transactionController',
  ['$scope', '$location', 'transactionService',
  function ($scope, $location, transactionService) {

    $scope.transactions = [];
    $scope.balance = 0;
    $scope.categories = ['Clothing', 'Education', 'Entertainment', 'Food', 'Housing', 'Medical', 'Personal', 'Transportation', 'Utilities'];
    $scope.views = [];
    $scope.labels = [];
    $scope.data = [];

    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    $scope.options = {
      responsive: true,
      scales: {
        yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        ]
      }
    };

    $scope.labels2 = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data2 = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride2 = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options2 = {
      scales: {
        yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
        ]
      }
    };
    
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
              $scope.labels.push(view.date);
              $scope.data.push(view.balance);
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
          $scope.labels.push(view.date);
          $scope.data.push(view.balance);
          $scope.labels.reverse();
          $scope.data.reverse();
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
        })
        .catch(function () {
          // DO something
        });
    };

}]);