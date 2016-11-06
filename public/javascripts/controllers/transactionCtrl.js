angular.module('EZBudget').controller('transactionController',
  ['$scope', '$location', 'transactionService',
  function($scope, $location, transactionService) {
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
        .then(function(response) {
          if (response.data.obj.length != 0) {
            var dateSet = response.data.obj[0].date.substring(0,7);
            var view = null;
            var earning = 0;
            var expense = 0;
            for (var i = 0; i < response.data.obj.length; i++) {
              var transaction = {
                id: response.data.obj[i]._id,
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
        .catch(function() {
          // DO something
        });
    };

    $scope.addTransaction = function() {
      transactionService.addTransaction($scope.transaction.date, $scope.transaction.category, $scope.transaction.description, $scope.transaction.type, $scope.transaction.amount)
        .then(function(response) {
          var transaction = {
            id: response.data.obj._id,
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
          $location.path('/transactions');
        })
        .catch(function() {
          // DO something
        });
    };

    $scope.removeTransaction = function(id) {
      transactionService.removeTransaction(id)
        .then(function(response) {
          console.log(response.data.obj);
          // REMOVE THE DATA FROM BAR CHART
          var date = response.data.obj.date.substring(0,7);
          var bindex = $scope.barlabels.indexOf(date);
          if (response.data.obj.type == 'Earning') {
            $scope.bardata[0][bindex] -= response.data.obj.amount;
          } else {
            $scope.bardata[1][bindex] -= response.data.obj.amount;
          }
          /* 
          * REMOVE THE LABEL DATE FOR BAR CHART
          * AND VIEW PERIOD IF THERE IS NO DATA LEFT FOR
          * THAT PERIOD.
          */
          if ($scope.bardata[0][bindex] == 0 && $scope.bardata[1][bindex] == 0) {
            $scope.barlabels.splice(bindex,1);
            $scope.views = $scope.views.filter(function(view) {
              return view != date;
            });
          }
          // REMOVE THE DATA FROM PIE CHART
          if (response.data.obj.type == 'Expense') {
            var category = response.data.obj.category;
            var pindex = $scope.pielabels.indexOf(category);
            $scope.piedata[pindex] -= response.data.obj.amount;
          }
          $scope.transactions = $scope.transactions.filter(function(obj) {
            return obj.id != id;
          });
        })
        .catch(function() {

        });
    };

    $scope.editTransaction = function(id) {
      transactionService.editTransaction(id, $scope.transaction.date, $scope.transaction.category, $scope.transaction.description, $scope.transaction.type, $scope.transaction.amount)
        .then(function(response) {
          $scope.transactions = $.grep($scope.transactions, function(transaction) {
            if (transaction.id == id) {
              transaction.date = JSON.stringify($scope.transaction.date).substring(1,25);
              transaction.category = $scope.transaction.category;
              transaction.description = $scope.transaction.description;
              transaction.type = $scope.transaction.type;
              transaction.amount = $scope.transaction.amount;
            }
          });
        })
        .catch(function() {

        });
    };

}]);