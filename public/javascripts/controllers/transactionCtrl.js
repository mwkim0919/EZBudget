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
      },
      scaleStartValue: 0,
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
              addPieData(transaction);
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
          $scope.balance += transaction.amount;
          // NEED TO RESORT THE TRANSACTION
          
          // ADD NEW TRANSACTION INTO BAR CHART
          addBarData(transaction);
          // ADD NEW TRANSACTION INTO PIE CHART
          addPieData(transaction);
          // RESET
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
          removeBarData(response.data.obj);
          // REMOVE THE DATA FROM PIE CHART
          removePieData(response.data.obj);
          // REMOVE THE DATA FROM TRANSACTIONS ARRAY
          $scope.transactions = $scope.transactions.filter(function(obj) {
            return obj.id != id;
          });
        })
        .catch(function() {

        });
    };

    $scope.editTransaction = function(id) {
      transactionService.editTransaction(
        id, 
        $scope.transactionEdit.date, 
        $scope.transactionEdit.category,
        $scope.transactionEdit.description, 
        $scope.transactionEdit.type, 
        $scope.transactionEdit.amount
        )
        .then(function(response) {
          var editedTransaction = $scope.transactions.filter(function (transaction) {
            return transaction.id == id;
          });
          // REMOVE OLD DATA FROM BAR CHART
          removeBarData(editedTransaction[0]);
          // REMOVE OLD DATA FROM PIE CHART
          removePieData(editedTransaction[0]);
          // UPDATE THE TABLE
          editedTransaction[0].date = JSON.stringify($scope.transactionEdit.date).substring(1,25);
          editedTransaction[0].category = $scope.transactionEdit.category;
          editedTransaction[0].description = $scope.transactionEdit.description;
          editedTransaction[0].type = $scope.transactionEdit.type;
          editedTransaction[0].amount = ($scope.transactionEdit.type == 'Expense') ? -$scope.transactionEdit.amount : $scope.transactionEdit.amount;
          // UPDATE BAR CHART
          addBarData(editedTransaction[0]);
          // UPDATE PIE CHART
          addPieData(editedTransaction[0]);
          // RESET
          $scope.transactionEdit = {};
          $('#transaction-edit-form').modal('toggle');
          $location.path('/transactions');
        })
        .catch(function() {

        });
    };

    $scope.fetchTransaction = function(id) {
      var result = $scope.transactions.filter(function (transaction) {
        return transaction.id == id;
      });
      $scope.transactionEdit = {
        id: result[0].id,
        date: new Date(result[0].date),
        category: result[0].category,
        description: result[0].description,
        type: result[0].type,
        amount: Math.abs(result[0].amount),
      };
    }

    // ===== HELPER FUNCTIONS ===== //
    function removeBarData(obj) {
      // REMOVE OLD DATA FROM BAR CHART
      var date = obj.date.substring(0,7);
      var oldAmount = Math.abs(obj.amount);
      var bindex = $scope.barlabels.indexOf(date);
      if (obj.type == 'Earning') {
        $scope.bardata[0][bindex] -= oldAmount;
      } else {
        $scope.bardata[1][bindex] -= oldAmount;
      }
      checkBarLabel(bindex);
    }

    function checkBarLabel(index) {
      var date = $scope.barlabels[index];
      if ($scope.bardata[0][index] == 0 && $scope.bardata[1][index] == 0) {
        $scope.barlabels.splice(index,1);
        $scope.bardata[0].splice(index,1);
        $scope.bardata[1].splice(index,1);
        $scope.views = $scope.views.filter(function(view) {
          return view != date;
        });
      }
    }

    function removePieData(obj) {
      if (obj.type == 'Expense') {
        var category = obj.category;
        var pindex = $scope.pielabels.indexOf(category);
        $scope.piedata[pindex] -= Math.abs(obj.amount);
      }
    }

    function addBarData(obj) {
      var date = obj.date.substring(0,7);
      var index = $scope.barlabels.indexOf(date);
      if (index >= 0) {
        if (obj.type == 'Earning') {
          $scope.bardata[0][index] += Math.abs(obj.amount);
        } else {
          $scope.bardata[1][index] += Math.abs(obj.amount);
        }
      } else {
        $scope.views.push(date);
        $scope.views.sort();
        $scope.views.reverse();
        $scope.barlabels.push(date);
        $scope.barlabels.sort();
        index = $scope.barlabels.indexOf(date);
        if (obj.type == 'Earning') {
          $scope.bardata[0].splice(index, 0, Math.abs(obj.amount));
          $scope.bardata[1].splice(index, 0, 0);
        } else {
          $scope.bardata[1].splice(index, 0, Math.abs(obj.amount));
          $scope.bardata[0].splice(index, 0, 0);
        }
      }
    }

    function addPieData(obj) {
      if (obj.type == 'Expense') {
        var index = $scope.pielabels.indexOf(obj.category);
        if (index >= 0) {
          $scope.piedata[index] += Math.abs(obj.amount);
        } else {
          $scope.piedata[0] += Math.abs(obj.amount);
        }
      }
    }

}]);