angular.module('EZBudget').factory('transactionService',
	['$q', '$timeout', '$http',
	function($q, $timeout, $http) {
    var transactions = [];

    return ({
      getTransactions: getTransactions,
      addTransaction: addTransaction,
      removeTransaction: removeTransaction,
      // editTransaction: editTransaction
    });

    function getTransactions() {
      return $http.get('/transactions')
      // handle success
      .success(function(data) {
        // DO SOMETHING
      })
      // handle error
      .error(function(data) {
        // DO SOMETHING
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
      .success(function(data, status) {
        if (status === 201 && data.status) {
          // DO something
        }
      })
      .error(function(data) {
        // DO something
      });
    }
    
    function removeTransaction(id) {
      return $http.delete('/transactions/' + id)
      // handle success
      .success(function(status) {
        // DO something
      })
      // handle error
      .error(function(data) {
        // DO something
      });
    }
}]);