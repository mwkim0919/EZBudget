angular.module('EZBudget').factory('transactionService',
	['$q', '$timeout', '$http',
	function ($q, $timeout, $http) {
    var transactions = [];

    return ({
      getTransactions: getTransactions,
      addTransaction: addTransaction,
      // removeTransaction: removeTransaction,
      // editTransaction: editTransaction
    });

    function getTransactions() {
      return $http.get('/transactions')
      // handle success
      .success(function (data) {
        // DO SOMETHING
        // for (var i = 0; i < data.obj.length; i++) {
        //   var transaction = {
        //     date: data.obj[i].date,
        //     category: data.obj[i].category,
        //     description: data.obj[i].description,
        //     type: data.obj[i].type,
        //     amount: data.obj[i].amount
        //   };
        //   transactions.push(transaction);
        // }
        // console.log(transactions);
        // return transactions;
      })
      // handle error
      .error(function (data) {

      });
    }

    function addTransaction(date, category, description, type, amount) {
      return $http.post('/transactions',
        {
          date: date, 
          category: category, 
          description: description,
          type: type,
          amount: amount,
        }
      )
      // handle success
      .success(function (data, status) {
        if (status === 201 && data.status) {
          // DO something
        }
      })
      .error(function (data) {
        // DO something
      });
    }
    
}]);