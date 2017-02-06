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
    $scope.barorigin = [[0], [0]];
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
    $scope.piecolors = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'];
    $scope.pieoptions = {
      legend: {
        display: true,
        position: 'left',
        labels: ['Others', 'Clothing', 'Education', 'Entertainment', 'Food', 'Housing', 'Medical', 'Personal', 'Transportation', 'Utilities'],
      },
    }

    $scope.cur_spending = 0;
    $scope.cur_earning = 0;
    $scope.spend_earn_ratio = 0;
    $scope.max = daysInMonth(new Date().getMonth(), new Date().getFullYear());
    $scope.day = new Date().getDate();
    $scope.cycle = $scope.day / $scope.max * 100;
    $scope.monthStatus = getStatus($scope.cycle);

    $scope.classes = ['fa-circle-o', 'fa-shopping-cart', 'fa-book', 'fa-futbol-o', 'fa-cutlery', 'fa-home', 'fa-medkit', 'fa-user', 'fa-car', 'fa-mobile'];
    $scope.topSpending = [];

    $scope.sortKey = 'date';
    $scope.reverse = true;
    $scope.sort = function(key) {
      $scope.sortKey = key;
      $scope.reverse = !$scope.reverse;
    };

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

            getMonthlyProgress();

            getTopSpendings();

            editPieData($scope.piedata);
          }
        })
        .catch(function() {
          // DO something
        });
    };

    $scope.addTransaction = function() {
      if (!$scope.transaction.date) {
        $scope.errorDate = 'Date Required.';
      } else {
        transactionService.addTransaction($scope.transaction.date, $scope.transaction.category, 
          $scope.transaction.description, $scope.transaction.type, $scope.transaction.amount)
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
            $scope.errorDate = '';
            $('#transaction-form').modal('toggle', function() {
              $scope.errorDate = '';
            });
            $location.path('/transactions');
          })
          .catch(function() {
            // DO something
          });
      }
    };

    $scope.removeTransaction = function(id) {
      transactionService.removeTransaction(id)
        .then(function(response) {
          // console.log(response.data.obj);
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
      if (!$scope.transactionEdit.date) {
        $scope.errorEditDate = 'Date required.';
      } else {
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
            editedTransaction[0].amount = ($scope.transactionEdit.type == 'Expense') ? 
              -$scope.transactionEdit.amount : $scope.transactionEdit.amount;
            // UPDATE BAR CHART
            addBarData(editedTransaction[0]);
            // UPDATE PIE CHART
            addPieData(editedTransaction[0]);
            // RESET
            $scope.transactionEdit = {};
            $scope.errorEditDate = '';
            $('#transaction-edit-form').modal('toggle', function() {
              $scope.errorEditDate = '';
            });
            $location.path('/transactions');
          })
          .catch(function() {

          });
      }
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

    // ========================== HELPER FUNCTIONS ============================== //
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

    function editPieData(obj) {
      var total = obj.reduce(function(total, num) {
        return total + num;
      });
      for (var i = 0; i < obj.length; i++) {
        obj[i] = Math.round(obj[i] / total * 100);
      }
    }

    function getMonthlyProgress() {
      var cur_month = $scope.barlabels[$scope.barlabels.length-1];
      if (cur_month == JSON.stringify(new Date()).substring(1,8)) {
        $scope.cur_earning = $scope.bardata[0][$scope.barlabels.length-1];
        $scope.cur_spending = $scope.bardata[1][$scope.barlabels.length-1];
        if ($scope.cur_earning != 0) {
          $scope.spend_earn_ratio = $scope.cur_spending / $scope.cur_earning * 100;
        }
      }
      $scope.budgetStatus = getStatus($scope.spend_earn_ratio);
    }

    function getTopSpendings() {
      var sorted = $scope.piedata.slice().sort(function(a,b){return b-a})
      $scope.pieranks = $scope.piedata.slice().map(function(v){ return sorted.indexOf(v)+1 });
      for (var i = 0; i < $scope.pieranks.length; i++) {
        var category = {
          name: $scope.pielabels[i],
          class: $scope.classes[i],
          amount: $scope.piedata[i],
          rank: $scope.pieranks[i],
        }
        $scope.topSpending.push(category);
      }
    }

    function daysInMonth(m, y) { // m is 0 indexed: 0-11
      switch (m) {
        case 1 :
        return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
        case 8 : case 3 : case 5 : case 10 :
        return 30;
        default :
        return 31
      }
    }

    function getStatus(p) {
      if (p < 25) {
        return 'success';
      } else if (p < 50) {
        return 'info';
      } else if (p < 75) {
        return 'warning';
      } else {
        return 'danger';
      }
    }
}]);