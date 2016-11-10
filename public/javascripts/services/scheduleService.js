angular.module('EZBudget').factory('scheduleService',
	['$q', '$timeout', '$http',
	function($q, $timeout, $http) {
    var schedules = [];

    return ({
      getSchedules: getSchedules,
      addSchedule: addSchedule,
      removeSchedule: removeSchedule,
      editSchedule: editSchedule
    });

    function getSchedules() {
      return $http.get('/schedules')
      // handle success
      .success(function(data) {
        // DO something
      })
      // handle error
      .error(function(data) {
        // DO something
      });
    }

    function addSchedule(title, category, start, end, description) {
      return $http.post('/schedules',
        {
          title: title, 
          category: category,
          startDate: start, 
          endDate: end,
          description: description,
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
    
    function removeSchedule(id) {
      return $http.delete('/schedules/' + id)
      // handle success
      .success(function(status) {
        // DO something
      })
      // handle error
      .error(function(status) {
        // DO something
      });
    }

    function editSchedule(id, title, category, start, end, description) {
      return $http.patch('/schedules/' + id,
        {
          title: title, 
          category: category,
          startDate: start, 
          endDate: end,
          description: description,
        }
      )
      // handle success
      .success(function(status) {
        // DO something
      })
      // handle error
      .error(function(status) {

      });
    }

}]);