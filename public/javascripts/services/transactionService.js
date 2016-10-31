angular.module('EZBudget').factory('transactionService',
	['$q', '$timeout', '$http', 'AuthService',
	function ($q, $timeout, $http) {
    var transactions = [];
    var current_user = AuthService.getCurrentUserName();

    return ({
      getTransactions: getTransactions,
      addTransaction: addTransaction,
      removeTransaction: removeTransaction,
      editTransaction: editTransaction
    });

    function getTransactions() {
      return $http.get('/transactions')
      // handle success
      .success(function (data) {
        if (data.obj) {
          transactions = data.obj;
        } else {

        }
      })
      // handle error
      .error(function (data) {

      });
    }

    function addTransaction() {
      return $http.post('/transactions',
        {
          date: date, 
          category: category, 
          description: description,
          type: type,
          amount: amount,
          user: current_user
        }
      )
      // handle success
      .success(function (data, status) {
        if (status === 201 && data.status) {

        }
      })
    }
    
}]);