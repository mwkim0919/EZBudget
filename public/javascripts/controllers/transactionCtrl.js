angular.module('EZBudget').controller('transactionController',
  ['$scope', '$location', 'transactionService',
  function ($scope, $location, transactionService) {
    $scope.transactions = [];
    $scope.balance = 0;
    $scope.categories = ['Clothing', 'Education', 'Entertainment', 'Food', 'Housing', 'Medical', 'Personal', 'Transportation', 'Utilities'];
    $scope.views = [];

    $scope.barlabels = [];
    $scope.barseries = ["Earning", "Expense"];
    $scope.bardata = [[], []];
    $scope.barcolors = ['#ff6384', '#45b7cd'];
    $scope.baroptions = {
      legend: {
        display: true,
        labels: ["Earning", "Expense"],
      }
    };

    $scope.pielabels = ['Others', 'Clothing', 'Education', 'Entertainment', 'Food', 'Housing', 'Medical', 'Personal', 'Transportation', 'Utilities'];
    $scope.piedata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.pieoptions = {
      legend: {
        display: true,
        position: 'right',
        labels: ['Others', 'Clothing', 'Education', 'Entertainment', 'Food', 'Housing', 'Medical', 'Personal', 'Transportation', 'Utilities'],
      }
    }

    $scope.getTransactions = function() {
      transactionService.getTransactions()
        .then(function (response) {
          if (response) {
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
              // ADD TRANSACTION DATA INTO PIE CHART
              var type = transaction.type;
              if (type == 'Expense') {
                var tindex = $scope.pielabels.indexOf(transaction.category);
                if (tindex >= 0) {
                  $scope.piedata[tindex] += -transaction.amount;
                } else {
                  $scope.piedata[0] += -transaction.amount;
                }
              }
              // ADD TRANSACTION DATA INTO BAR CHART
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
              // ADD TRANSACTION TO TRANSACTIONS ARRAY
              $scope.balance += transaction.amount;
              $scope.transactions.push(transaction);
            }
            // ADD THE LAST DATA INTO BAR AND PIE CHART
            $scope.views.push(dateSet);
            $scope.barlabels.push(dateSet);
            $scope.bardata[0].push(earning);
            $scope.bardata[1].push(expense);
            earning = 0;
            expense = 0;
            $scope.barlabels.reverse();
            $scope.bardata[0].reverse();
            $scope.bardata[1].reverse();
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
            date: JSON.stringify($scope.transaction.date).substring(1,25),
            category: $scope.transaction.category,
            description: $scope.transaction.description,
            type: $scope.transaction.type,
            amount: ($scope.transaction.type == 'Expense') ? -$scope.transaction.amount : $scope.transaction.amount
          }
          $scope.transactions.push(transaction);
          // NEED TO RESORT THE TRANSACTION
          $scope.balance += transaction.amount;
          var date = transaction.date.substring(0,7);
          var tindex = $scope.barlabels.indexOf(date);
          var type = transaction.type;
          var cindex = $scope.pielabels.indexOf(transaction.category);
          // ADD NEW TRANSACTION INTO BAR CHART
          if (tindex >= 0) {
            if (type == 'Earning') {
              $scope.bardata[0][tindex] += transaction.amount;
            } else {
              $scope.bardata[1][tindex] += -transaction.amount;
            }
          } else {
            $scope.views.push(date);
            $scope.views.sort();
            $scope.views.reverse();
            $scope.barlabels.push(date);
            $scope.barlabels.sort();
            tindex = $scope.barlabels.indexOf(date);
            if (type == 'Earning') {
              $scope.bardata[0].splice(tindex, 0, transaction.amount);
              $scope.bardata[1].splice(tindex, 0, 0);
            } else {
              $scope.bardata[0].splice(tindex, 0, 0);
              $scope.bardata[1].splice(tindex, 0, -transaction.amount);
            }
          }
          // ADD NEW TRANSACTION INTO PIE CHART
          if (type == 'Expense') {
            if (cindex >= 0) {
              $scope.piedata[cindex] += -transaction.amount;
            } else {
              $scope.piedata[0] += -transaction.amount;
            }
          }
          $scope.transaction = {};
          $('#transaction-form').modal('toggle');
          $location.path('/finance');
        })
        .catch(function () {
          // DO something
        });
    };

}]);